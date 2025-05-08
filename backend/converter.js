
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const PDFDocument = require('pdfkit');

// Set up a directory for output PDFs
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

/**
 * Convert various file types to PDF
 */
async function convertToPdf(files) {
  // If multiple files, merge them into one PDF
  if (files.length > 1) {
    return mergeFilesToPdf(files);
  }
  
  // Single file conversion
  const file = files[0];
  const fileExt = path.extname(file.originalname).toLowerCase();
  const outputPath = path.join(outputDir, `${path.basename(file.originalname, fileExt)}-${Date.now()}.pdf`);
  
  try {
    console.log(`Converting ${file.originalname} to PDF...`);
    
    // Handle different file types
    switch (fileExt) {
      case '.docx':
      case '.doc':
        await convertDocumentToPdf(file.path, outputPath);
        break;
      case '.xlsx':
      case '.xls':
        await convertSpreadsheetToPdf(file.path, outputPath);
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
        await convertImageToPdf(file.path, outputPath);
        break;
      case '.html':
        await convertHtmlToPdf(file.path, outputPath);
        break;
      case '.txt':
        await convertTextToPdf(file.path, outputPath);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileExt}`);
    }
    
    return outputPath;
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
}

/**
 * Merge multiple files into a single PDF
 */
async function mergeFilesToPdf(files) {
  const outputPath = path.join(outputDir, `merged-${Date.now()}.pdf`);
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  
  doc.pipe(writeStream);
  
  // Process each file and add to the PDF
  for (const file of files) {
    try {
      const fileExt = path.extname(file.originalname).toLowerCase();
      const tempPdfPath = path.join(outputDir, `temp-${Date.now()}.pdf`);
      
      // Convert the file to PDF first
      switch (fileExt) {
        case '.docx':
        case '.doc':
          await convertDocumentToPdf(file.path, tempPdfPath);
          break;
        case '.xlsx':
        case '.xls':
          await convertSpreadsheetToPdf(file.path, tempPdfPath);
          break;
        case '.png':
        case '.jpg':
        case '.jpeg':
          await convertImageToPdf(file.path, tempPdfPath);
          doc.addPage();
          doc.image(file.path, {
            fit: [500, 700],
            align: 'center',
            valign: 'center'
          });
          continue; // Skip the rest for images, as we handle them directly
        case '.html':
          await convertHtmlToPdf(file.path, tempPdfPath);
          break;
        case '.txt':
          // For text files, we can add them directly
          doc.addPage();
          const text = fs.readFileSync(file.path, 'utf8');
          doc.fontSize(12).text(text);
          continue; // Skip the rest for text files
        default:
          console.log(`Skipping unsupported file type: ${fileExt}`);
          continue;
      }
      
      // For non-image and non-text files, we need to add an annotation
      doc.addPage();
      doc.fontSize(14).text(`File: ${file.originalname}`, {
        align: 'center'
      });
      
      // Clean up temp file
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
      // Continue with other files even if one fails
    }
  }
  
  // Finalize the PDF
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

/**
 * Convert Word documents to PDF
 */
async function convertDocumentToPdf(inputPath, outputPath) {
  // For a production app, you would use a library like libreoffice-convert or unoconv
  // For this example, we'll use a placeholder that creates a simple PDF
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  
  doc.pipe(writeStream);
  doc.fontSize(16).text('Document Conversion', { align: 'center' });
  doc.fontSize(12).text(`Converted from: ${path.basename(inputPath)}`, { align: 'center' });
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

/**
 * Convert spreadsheets to PDF
 */
async function convertSpreadsheetToPdf(inputPath, outputPath) {
  // Similar placeholder as the document conversion
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  
  doc.pipe(writeStream);
  doc.fontSize(16).text('Spreadsheet Conversion', { align: 'center' });
  doc.fontSize(12).text(`Converted from: ${path.basename(inputPath)}`, { align: 'center' });
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

/**
 * Convert images to PDF
 */
async function convertImageToPdf(inputPath, outputPath) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  
  doc.pipe(writeStream);
  doc.image(inputPath, {
    fit: [500, 700],
    align: 'center',
    valign: 'center'
  });
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

/**
 * Convert HTML to PDF
 */
async function convertHtmlToPdf(inputPath, outputPath) {
  // Placeholder for HTML conversion
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  
  doc.pipe(writeStream);
  doc.fontSize(16).text('HTML Conversion', { align: 'center' });
  doc.fontSize(12).text(`Converted from: ${path.basename(inputPath)}`, { align: 'center' });
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

/**
 * Convert text files to PDF
 */
async function convertTextToPdf(inputPath, outputPath) {
  const text = fs.readFileSync(inputPath, 'utf8');
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  
  doc.pipe(writeStream);
  doc.fontSize(12).text(text);
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

module.exports = {
  convertToPdf
};
