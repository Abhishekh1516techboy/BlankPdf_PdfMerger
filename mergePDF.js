// mergePDF.js
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib'; // Assuming pdf-lib is used

async function mergePDFs(inputPaths, outputFolder) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of inputPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

        copiedPages.forEach(page => {
            mergedPdf.addPage(page);
        });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(outputFolder, `merged_${Date.now()}.pdf`);

    fs.writeFileSync(outputPath, mergedPdfBytes);

    return path.basename(outputPath);
}

export default mergePDFs;
