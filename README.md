# PDF Page Counter

A full-stack web application for counting pages in PDF files. Upload single or multiple PDFs and export results to Excel.

## Prerequisites

- Node.js (v14 or higher)
- Python 3.6+ (for creating sample PDFs)
- npm or yarn

## Installation

### 1. Create Sample PDFs

```bash
cd PDF-PageCount
python create_sample_pdfs.py
```

This will create 6 sample PDFs with different page counts in the `sample-pdfs` folder:
- report-2024.pdf (5 pages)
- presentation.pdf (12 pages)
- manual.pdf (8 pages)
- guide.pdf (15 pages)
- summary.pdf (3 pages)
- whitepaper.pdf (20 pages)

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The application will run on `http://localhost:3000`



## Technologies Used

### Backend
- **Express.js** - Web framework
- **pdf-parse** - PDF processing library
- **ExcelJS** - Excel file generation
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
