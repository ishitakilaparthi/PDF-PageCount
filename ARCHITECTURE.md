# Architecture & Technical Documentation

## Overview

PDF Page Counter is a full-stack web application built with modern technologies for processing and analyzing PDF files.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  - Components: SinglePDF, MultiplePDF, ResultsDisplay       │
│  - Styling: Tailwind CSS with gradient backgrounds          │
│  - HTTP Client: Axios for API calls                         │
│  - Port: 3000                                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST API
                    (CORS enabled)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Backend (Express.js)                       │
│  - File Upload: Multer middleware                           │
│  - PDF Processing: pdf-parse library                        │
│  - Excel Export: ExcelJS library                            │
│  - Port: 5000                                               │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    Uploads/       Exports/          Node.js
   Temp Files     Excel Files        FileSystem
```

## Technology Stack

### Frontend
- **React 18.2** - UI library
  - Hooks for state management
  - Functional components
- **Tailwind CSS 3.2** - Utility-first CSS framework
- **Axios 1.3** - HTTP client for API calls
- **React Icons 4.7** - Icon library
- **React Scripts** - Build tooling

### Backend
- **Express.js 4.18** - Web framework
- **Node.js** - Runtime environment
- **pdf-parse 1.1** - PDF text extraction and metadata
- **ExcelJS 4.3** - Excel workbook creation
- **Multer 1.4** - File upload middleware
- **CORS 2.8** - Cross-origin resource sharing

## Data Flow

### Single PDF Upload Flow

```
User selects PDF
    ↓
[Frontend] Form submission
    ↓
Multipart form-data POST to /api/upload-pdf
    ↓
[Backend] Multer receives file
    ↓
File saved to uploads/
    ↓
pdf-parse extracts page count
    ↓
Response sent with pageCount
    ↓
[Frontend] Displays results
    ↓
User can export to Excel
```

### Multiple PDF Processing Flow

```
User selects multiple PDFs
    ↓
[Frontend] Form submission with multiple files
    ↓
Multipart form-data POST to /api/process-folder
    ↓
[Backend] Multer receives files
    ↓
Files saved to uploads/
    ↓
Loop through each file
    → pdf-parse extracts page count
    → Store results in array
    ↓
Calculate total pages
    ↓
Response sent with all files and totals
    ↓
[Frontend] Displays table with results
    ↓
User can export to Excel
```

### Excel Export Flow

```
User clicks "Export to Excel"
    ↓
[Frontend] POST to /api/export-excel with data
    ↓
[Backend] ExcelJS creates workbook
    ↓
Add worksheet with columns and data
    ↓
Format headers and total row
    ↓
Write to file in exports/
    ↓
File sent as download
    ↓
[Frontend] Browser downloads file
    ↓
Temporary file deleted from server
```

## Key Components

### Frontend Components

**App.js**
- Main component managing mode selection
- Routes between SinglePDF and MultiplePDF
- Provides UI shell with branding

**SinglePDF.js**
- Drag-and-drop file upload
- File validation
- Loading state management
- Result display integration

**MultiplePDF.js**
- Multiple file selection
- Drag-and-drop for batch upload
- Progress indication
- Results management

**ResultsDisplay.js**
- Shows success message
- Displays results in cards or tables
- Export button
- Reset functionality

### Backend Endpoints

**POST /api/upload-pdf**
- Accepts: FormData with single PDF file
- Processes: pdf-parse on file
- Returns: fileName, pageCount, filePath
- Stores: File in uploads/

**POST /api/process-folder**
- Accepts: FormData with multiple PDF files
- Processes: pdf-parse on each file
- Returns: Array of files with counts, totalPages
- Stores: All files in uploads/

**POST /api/export-excel**
- Accepts: JSON with results data and mode
- Processes: ExcelJS workbook creation
- Returns: Excel file download
- Cleanup: Deletes temp file after download

**GET /api/health**
- Simple health check
- Returns: Status message

## File Management

### Upload Directory (`backend/uploads/`)
- Purpose: Temporary storage for uploaded PDFs
- Cleanup: Files can be manually deleted or via cron job
- Size: Configurable limit (default 50MB per file)

### Export Directory (`backend/exports/`)
- Purpose: Temporary storage for generated Excel files
- Cleanup: Files deleted after download completes
- Format: XLSX (Excel 2007+)

## API Response Format

### Success Response (Single PDF)
```json
{
  "success": true,
  "fileName": "document.pdf",
  "pageCount": 42,
  "filePath": "/path/to/uploads/1234567890-document.pdf"
}
```

### Success Response (Multiple PDFs)
```json
{
  "success": true,
  "files": [
    { "fileName": "doc1.pdf", "pageCount": 10, "filePath": "..." },
    { "fileName": "doc2.pdf", "pageCount": 20, "filePath": "..." }
  ],
  "totalPages": 30,
  "fileCount": 2
}
```

### Error Response
```json
{
  "error": "Only PDF files are allowed"
}
```

## Excel File Structure

### Single PDF Export
| File Name | Page Count |
|-----------|-----------|
| document.pdf | 42 |

### Multiple PDFs Export
| File Name | Page Count |
|-----------|-----------|
| report.pdf | 15 |
| manual.pdf | 8 |
| guide.pdf | 5 |
| TOTAL | 28 |

## Performance Considerations

### PDF Processing
- pdf-parse loads entire PDF into memory
- Average processing time: 50-200ms per page
- Recommendation: Process files <50MB
- For batch: Implement queue system for large batches

### Excel Generation
- ExcelJS creates file in memory
- Time: 100-500ms depending on file count
- Memory: Minimal (typically <10MB for 100 files)

### Frontend
- React re-renders on state change
- File upload doesn't block UI (async)
- Loading states provided for user feedback

### Backend
- Single-threaded (consider clustering in production)
- Multer handles file streaming efficiently
- No database queries (stateless)

## Security Measures

1. **File Type Validation**
   - Only .pdf MIME type accepted
   - Validated on both frontend and backend

2. **File Size Limits**
   - Default: 50MB per file
   - Configurable in server.js

3. **Temporary File Cleanup**
   - Export files deleted after download
   - Consider scheduled cleanup for uploads

4. **CORS Protection**
   - Limited to configured origins
   - Headers validated

5. **Error Handling**
   - Generic error messages to users
   - Detailed logs for developers

## Scalability Improvements

1. **Database Integration**
   - Store processing history
   - Track file analytics

2. **Queue System**
   - Bull.js for large batch processing
   - Prevent server overload

3. **Caching**
   - Cache page count results
   - Reduce duplicate processing

4. **Microservices**
   - Separate PDF processing service
   - Independent scaling

5. **Cloud Storage**
   - AWS S3 for file storage
   - Automatic cleanup

## Testing Recommendations

### Unit Tests
- API endpoint validation
- PDF parsing accuracy
- Excel generation format

### Integration Tests
- Full workflow from upload to export
- Error handling paths

### Load Testing
- Concurrent file uploads
- Large file handling
- Memory usage monitoring

### User Testing
- UI/UX feedback
- Accessibility verification
- Cross-browser compatibility

## Future Enhancements

1. **Advanced Features**
   - PDF text extraction
   - Image extraction
   - Metadata analysis

2. **User Features**
   - User accounts with history
   - Batch processing queue
   - Scheduled reports

3. **Cloud Integration**
   - Google Drive upload
   - OneDrive sync
   - Dropbox integration

4. **Automation**
   - Webhooks for external systems
   - Email notifications
   - API for third-party apps
