# Getting Started with PDF Page Counter

Welcome! This guide will help you get the PDF Page Counter application up and running.

## What is PDF Page Counter?

PDF Page Counter is a web application that allows you to:
- 📄 Upload a single PDF and instantly see its page count
- 📁 Upload multiple PDFs and get a comprehensive summary
- 📊 Export results to Excel spreadsheets
- 🎨 Enjoy a beautiful, modern user interface

## Prerequisites

Before you start, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Python 3.6+** (optional, for generating sample PDFs) - [Download](https://www.python.org/)

To verify installation:
```bash
node --version
npm --version
```

## Project Structure

```
PDF-PageCount/
├── backend/              # Express.js server for PDF processing
├── frontend/             # React application (user interface)
├── sample-pdfs/          # Sample PDF files for testing
├── QUICKSTART.md         # 5-minute quick start
├── README.md             # Complete documentation
├── DEPLOYMENT.md         # Deployment guides for various platforms
└── ARCHITECTURE.md       # Technical documentation
```

## Option 1: Quick Start (Windows)

Simply double-click `start.bat`:
```
start.bat
```

This will automatically:
1. Install dependencies for backend and frontend
2. Start the backend server on port 5000
3. Start the frontend on port 3000
4. Open the application in your browser

## Option 2: Quick Start (Mac/Linux)

Make the script executable and run:
```bash
chmod +x start.sh
./start.sh
```

## Option 3: Manual Setup (All Platforms)

### Step 1: Create Sample PDFs (Optional)

```bash
# From project root
pip install reportlab
python create_sample_pdfs.py
```

This creates 6 sample PDFs:
- report-2024.pdf (5 pages)
- presentation.pdf (12 pages)
- manual.pdf (8 pages)
- guide.pdf (15 pages)
- summary.pdf (3 pages)
- whitepaper.pdf (20 pages)

### Step 2: Start Backend

```bash
cd backend
npm install
npm start
```

Expected output:
```
Server running on http://localhost:5000
```

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://xxx.xxx.xxx.xxx:3000
```

Your browser should open automatically to `http://localhost:3000`

## Using the Application

### Single PDF Mode

1. Click the "Single PDF" card on the home screen
2. Either:
   - Drag and drop a PDF onto the upload area, OR
   - Click "Select PDF" and choose a file
3. Wait for processing (usually 1-2 seconds)
4. View the page count
5. Click "Export to Excel" to download results (optional)

### Multiple PDFs Mode

1. Click the "Multiple PDFs" card on the home screen
2. Either:
   - Drag and drop multiple PDFs onto the upload area, OR
   - Click "Select PDFs" and choose multiple files
3. Wait for processing
4. View the results table with:
   - Individual PDF names and page counts
   - Total files processed
   - Total pages across all files
5. Click "Export to Excel" to download results (optional)

## Troubleshooting

### Issue: "Port 5000 is already in use"

Kill the process using the port:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue: "Port 3000 is already in use"

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: "npm install fails"

Try:
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### Issue: "CORS error in console"

Make sure:
1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:3000`
3. Both processes are in the same session

### Issue: "File upload doesn't work"

- Ensure file is a valid PDF
- Check file size (max 50MB by default)
- Clear browser cache and try again

### Issue: "Excel export fails"

- Ensure backend has write permissions in `backend/` directory
- Check disk space availability
- Restart the backend server

## Stopping the Application

### If using `start.bat` or `start.sh`:
Press `Ctrl+C` in the terminal windows

### If running manually:
1. In backend terminal: Press `Ctrl+C`
2. In frontend terminal: Press `Ctrl+C`

## Next Steps

- **Customize**: Edit UI in `frontend/src/components/`
- **Scale**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting options
- **Integrate**: See API endpoints in [README.md](./README.md#api-endpoints)
- **Understand**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

## File Upload Tips

- **Best file size**: 1-10 MB per PDF
- **Maximum size**: 50 MB per file (configurable)
- **Supported format**: PDF only
- **Batch upload**: Up to 20+ files at once (depending on total size)

## Export Tips

- Excel files are formatted with:
  - Bold headers with blue background
  - Table layout for multiple PDFs
  - Total row highlighted in gray
- Files can be edited in Excel after download
- Compatible with Google Sheets and LibreOffice Calc

## Performance Tips

1. **Compress PDFs** before uploading for faster processing
2. **Use batch mode** for multiple files instead of uploading one-by-one
3. **Clear uploads folder** periodically to free disk space
4. Keep browser cache clear for latest version

## Keyboard Shortcuts

- `Ctrl+C` - Stop the application
- `Ctrl+R` - Refresh browser
- `F12` - Open browser developer tools (for debugging)

## Getting Help

If you encounter issues:

1. Check console errors (F12 → Console tab)
2. Review server logs in terminal
3. Check [TROUBLESHOOTING.md](./README.md#troubleshooting) section
4. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| Storage | 500 MB | 2 GB |
| Node.js | v14 | v16+ |

## Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT - Feel free to use and modify!

## Support

For detailed information:
- README.md - Complete feature documentation
- QUICKSTART.md - 5-minute setup guide
- DEPLOYMENT.md - Production deployment options
- ARCHITECTURE.md - Technical architecture details

Enjoy using PDF Page Counter! 🎉
