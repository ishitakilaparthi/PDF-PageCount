# PDF Page Counter

A full-stack web application for counting pages in PDF files. Upload single or multiple PDFs and export results to Excel.

## Features

✨ **Single PDF Upload** - Upload one PDF and get instant page count
📁 **Batch Processing** - Upload multiple PDFs at once and get a summary
📊 **Excel Export** - Download results as Excel spreadsheet
🎨 **Beautiful UI** - Modern, responsive design with gradient backgrounds
⚡ **Fast Processing** - Quick PDF analysis using pdf-parse
📱 **Responsive Design** - Works on desktop and mobile devices

## Project Structure

```
PDF-PageCount/
├── backend/              # Node.js/Express API
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   ├── uploads/         # Temporary file storage
│   └── exports/         # Generated Excel files
├── frontend/            # React application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── package.json     # Frontend dependencies
│   └── tailwind.config.js
├── sample-pdfs/         # Sample PDF files for testing
└── create_sample_pdfs.py # Script to generate sample PDFs
```

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

## Usage

### Single PDF Mode
1. Click on "Single PDF" on the home screen
2. Drag and drop a PDF or click to select one
3. View the page count
4. Click "Export to Excel" to download the results

### Multiple PDFs Mode
1. Click on "Multiple PDFs" on the home screen
2. Drag and drop multiple PDFs or click to select files
3. View the summary with individual file counts and total pages
4. Click "Export to Excel" to download the results in a spreadsheet

## API Endpoints

### POST /api/upload-pdf
Upload a single PDF file
- **Body**: FormData with `file` field
- **Response**: `{ success: true, fileName: string, pageCount: number, filePath: string }`

### POST /api/process-folder
Upload multiple PDF files
- **Body**: FormData with `files` field (multiple)
- **Response**: `{ success: true, files: Array, totalPages: number, fileCount: number }`

### POST /api/export-excel
Export results to Excel file
- **Body**: 
  ```json
  {
    "data": { "files": Array, "totalPages": number } or { "fileName": string, "pageCount": number },
    "mode": "single" or "multiple"
  }
  ```
- **Response**: Excel file (.xlsx)

### GET /api/health
Health check endpoint
- **Response**: `{ status: "Server is running" }`

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

## Deployment

### Option 1: Heroku

**Backend:**
```bash
cd backend
heroku login
heroku create your-app-name-backend
heroku config:set NODE_ENV=production
git push heroku main
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or GitHub Pages
```

### Option 2: Render.com

**Backend:**
1. Push code to GitHub
2. Create new Web Service on Render.com
3. Connect your GitHub repository
4. Set runtime to Node
5. Add environment variables if needed
6. Deploy

**Frontend (Vercel):**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` in frontend directory
3. Follow prompts to deploy

### Option 3: DigitalOcean

**Using App Platform:**
1. Connect GitHub repository
2. Create app from `backend` and `frontend` folders separately
3. Set environment variables
4. Deploy

**Using Droplet (VPS):**
1. SSH into droplet
2. Install Node.js and npm
3. Clone repository
4. Run setup scripts
5. Use PM2 for process management
6. Configure Nginx as reverse proxy
7. Set up SSL with Let's Encrypt

### Option 4: AWS

**Using Elastic Beanstalk:**
```bash
# For Backend
eb create pdf-counter-env
eb deploy

# For Frontend
aws s3 sync build/ s3://your-bucket-name
```

**Using EC2:**
1. Launch EC2 instance
2. SSH and install Node.js
3. Clone repository
4. Set up environment variables
5. Run application with PM2
6. Configure security groups and Elastic IP

## Environment Variables

Create `.env` files if needed:

**Backend (.env):**
```
PORT=5000
NODE_ENV=development
```

## File Size Limits

Default maximum upload size: 50MB (configurable in server.js)

To change:
```javascript
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
```

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 5000
- Check that frontend proxy is set in package.json: `"proxy": "http://localhost:5000"`

### PDF Upload Fails
- Verify file is a valid PDF
- Check file size is under limit
- Ensure backend has write permissions to uploads directory

### Excel Export Issues
- Clear browser cache
- Ensure `exports` directory exists and is writable
- Check disk space availability

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## Performance Tips

1. **Compress PDFs** before uploading for faster processing
2. **Use batch processing** for multiple files instead of single uploads
3. **Enable gzip compression** in backend for faster API responses
4. **Use CDN** for frontend assets when deployed

## Security Considerations

1. **File Validation**: Only .pdf files are accepted
2. **File Limits**: Maximum upload size enforced
3. **Cleanup**: Temporary files are automatically cleaned up after export
4. **CORS**: Configured for your domain only in production

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

## Future Enhancements

- 🔐 User authentication and file history
- 📈 Advanced analytics and statistics
- 🎨 Custom Excel report templates
- 🔍 PDF text extraction
- 📧 Email export functionality
- 🌐 Multi-language support
- 💾 Cloud storage integration (Google Drive, OneDrive)
