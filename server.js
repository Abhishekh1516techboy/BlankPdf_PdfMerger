import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import fs from 'fs';
import mergePDFs from './mergePDF.js';
import bodyParser from 'body-parser';  // Import body-parser

const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mergedFolder = path.join(__dirname, 'merged');
if (!fs.existsSync(mergedFolder)) {
    fs.mkdirSync(mergedFolder);
}

app.use(bodyParser.urlencoded({ extended: true }));  // Middleware to parse form data
app.use('/static', express.static('public'));
app.use('/merged', express.static('merged'));

app.get('/home', (req, res) => {
    fs.readdir(mergedFolder, (err, files) => {
        if (err) {
            console.error(`Error reading merged folder: ${err}`);
            return res.sendStatus(500);
        }
        for (const file of files) {
            fs.unlink(path.join(mergedFolder, file), err => {
                if (err) {
                    console.error(`Error deleting file ${file}: ${err}`);
                }
            });
        }
        res.sendFile(path.join(__dirname, "index.html"));
    });
});

app.get('/about', (req, res) => {
    fs.readdir(mergedFolder, (err, files) => {
        if (err) {
            console.error(`Error reading merged folder: ${err}`);
            return res.sendStatus(500);
        }
        for (const file of files) {
            fs.unlink(path.join(mergedFolder, file), err => {
                if (err) {
                    console.error(`Error deleting file ${file}: ${err}`);
                }
            });
        }
        res.sendFile(path.join(__dirname, "about.html"));
    });
});

app.get('/contact', (req, res) => {
    fs.readdir(mergedFolder, (err, files) => {
        if (err) {
            console.error(`Error reading merged folder: ${err}`);
            return res.sendStatus(500);
        }
        for (const file of files) {
            fs.unlink(path.join(mergedFolder, file), err => {
                if (err) {
                    console.error(`Error deleting file ${file}: ${err}`);
                }
            });
        }
        res.sendFile(path.join(__dirname, "contact.html"));
    });
});

app.post('/merge', upload.array('pdfs', 10), async (req, res) => {
    if (!req.files || req.files.length < 2) {
        return res.status(400).send('Please upload at least 2 PDF files');
    }

    let mergedFilePaths = [];
    for (let file of req.files) {
        mergedFilePaths.push(path.join(__dirname, file.path));
    }

    let mergedFileName;
    try {
        mergedFileName = await mergePDFs(mergedFilePaths, mergedFolder);
    } catch (error) {
        return res.status(500).send('Error merging PDFs');
    }

    for (let file of req.files) {
        fs.unlink(path.join(__dirname, file.path), err => {
            if (err) {
                console.error(`Error deleting file ${file.path}:`, err);
            }
        });
    }

    res.redirect(`http://localhost:${port}/merged/${mergedFileName}`);
});

// Route to handle form submission
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;

    // You can now use this data to send an email, save to a database, etc.
    console.log(`Received message from ${name} (${email}): ${message}`);

    // Respond with a simple message or redirect
    res.send(`<h1 style="height:100vh; width:100%; text-align:center; align-content:start; color:blue;">Thank you for your message! Mr.${name}</br><a href="http://localhost:3000/contact"><button style="background-color:blue; color:white; font-size:20px; border-radius:8px; padding:5px; margin-top:15px; cursor:pointer; ">Go Back</button></a></h1><p>We will get back to you shortly.</p>`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/home`);
});
