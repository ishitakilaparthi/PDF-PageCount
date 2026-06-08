const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Function to get PDF page count
async function getPDFPageCount(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  return data.numpages;
}

// Route: Upload single PDF
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pageCount = await getPDFPageCount(req.file.path);
    
    res.json({
      success: true,
      fileName: req.file.originalname,
      pageCount,
      filePath: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Process folder with multiple PDFs
app.post('/api/process-folder', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];
    let totalPages = 0;

    for (const file of req.files) {
      const pageCount = await getPDFPageCount(file.path);
      results.push({
        fileName: file.originalname,
        pageCount,
        filePath: file.path
      });
      totalPages += pageCount;
    }

    res.json({
      success: true,
      files: results,
      totalPages,
      fileCount: results.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Export to Excel
app.post('/api/export-excel', async (req, res) => {
  try {
    const { data, mode } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PDF Analysis');

    if (mode === 'single') {
      worksheet.columns = [
        { header: 'File Name', key: 'fileName', width: 30 },
        { header: 'Page Count', key: 'pageCount', width: 15 }
      ];
      worksheet.addRow(data);
    } else {
      worksheet.columns = [
        { header: 'File Name', key: 'fileName', width: 30 },
        { header: 'Page Count', key: 'pageCount', width: 15 }
      ];
      
      data.files.forEach(file => {
        worksheet.addRow(file);
      });

      // Add total row
      const totalRow = worksheet.addRow({
        fileName: 'TOTAL',
        pageCount: data.totalPages
      });
      totalRow.font = { bold: true };
      totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
    }

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

    const fileName = `pdf-analysis-${Date.now()}.xlsx`;
    const filePath = path.join(__dirname, 'exports', fileName);
    
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, fileName, (err) => {
      if (err) console.error('Download error:', err);
      // Clean up after download
      fs.unlink(filePath, (err) => {
        if (err) console.error('File deletion error:', err);
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
