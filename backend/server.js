
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { convertToPdf } = require('./converter');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route for file conversion
app.post('/convert-to-pdf', upload.array('files'), async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`Received ${req.files.length} files for conversion`);
    
    // Process each file and convert to PDF
    const pdfPath = await convertToPdf(req.files);
    
    // Return the PDF file
    res.sendFile(pdfPath);
    
    // Clean up files after sending (optional, can be adjusted based on needs)
    setTimeout(() => {
      fs.unlink(pdfPath, (err) => {
        if (err) console.error('Error deleting temporary PDF:', err);
      });
      
      // Delete uploaded files
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting temporary upload:', err);
        });
      });
    }, 60000); // Delete after 1 minute
    
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert files' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PDF conversion endpoint available at http://localhost:${PORT}/convert-to-pdf`);
});
