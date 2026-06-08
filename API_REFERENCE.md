# PDF Page Counter - API Reference Guide

Quick reference for all API endpoints and data structures.

## 📡 API Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload-pdf` | Upload single PDF |
| POST | `/api/process-folder` | Upload multiple PDFs |
| POST | `/api/export-excel` | Export results to Excel |
| GET | `/api/health` | Server health check |

## 🔗 Detailed Endpoints

### 1. Upload Single PDF

**Endpoint**: `POST /api/upload-pdf`

**Request**:
```
Content-Type: multipart/form-data

Body:
  file: <PDF file>
```

**Success Response** (200):
```json
{
  "success": true,
  "fileName": "document.pdf",
  "pageCount": 42,
  "filePath": "/uploads/1234567890-document.pdf"
}
```

**Error Response** (400/500):
```json
{
  "error": "Only PDF files are allowed"
}
```

**cURL Example**:
```bash
curl -X POST \
  -F "file=@document.pdf" \
  http://localhost:5000/api/upload-pdf
```

**JavaScript/Fetch Example**:
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

fetch('http://localhost:5000/api/upload-pdf', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(data => console.log(data));
```

**Python Example**:
```python
import requests

with open('document.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://localhost:5000/api/upload-pdf',
        files=files
    )
print(response.json())
```

---

### 2. Process Multiple PDFs

**Endpoint**: `POST /api/process-folder`

**Request**:
```
Content-Type: multipart/form-data

Body:
  files: <PDF file 1>
  files: <PDF file 2>
  files: <PDF file 3>
  ...
```

**Success Response** (200):
```json
{
  "success": true,
  "files": [
    {
      "fileName": "report.pdf",
      "pageCount": 15,
      "filePath": "/uploads/123-report.pdf"
    },
    {
      "fileName": "manual.pdf",
      "pageCount": 8,
      "filePath": "/uploads/456-manual.pdf"
    }
  ],
  "totalPages": 23,
  "fileCount": 2
}
```

**Error Response** (400/500):
```json
{
  "error": "No files uploaded"
}
```

**cURL Example**:
```bash
curl -X POST \
  -F "files=@doc1.pdf" \
  -F "files=@doc2.pdf" \
  -F "files=@doc3.pdf" \
  http://localhost:5000/api/process-folder
```

**JavaScript/Fetch Example**:
```javascript
const formData = new FormData();
pdfFiles.forEach(file => {
  formData.append('files', file);
});

fetch('http://localhost:5000/api/process-folder', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(data => console.log(data));
```

---

### 3. Export to Excel

**Endpoint**: `POST /api/export-excel`

**Request**:
```json
{
  "mode": "single" | "multiple",
  "data": {
    // For single mode:
    "fileName": "document.pdf",
    "pageCount": 42
    
    // For multiple mode:
    "files": [
      {"fileName": "doc1.pdf", "pageCount": 10},
      {"fileName": "doc2.pdf", "pageCount": 20}
    ],
    "totalPages": 30,
    "fileCount": 2
  }
}
```

**Success Response** (200):
- File download (application/vnd.ms-excel)

**Error Response** (400/500):
```json
{
  "error": "Error exporting to Excel"
}
```

**Single Mode Example**:
```javascript
const response = await fetch(
  'http://localhost:5000/api/export-excel',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'single',
      data: {
        fileName: 'document.pdf',
        pageCount: 42
      }
    }),
    responseType: 'blob'
  }
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'report.xlsx';
a.click();
```

**Multiple Mode Example**:
```javascript
const response = await fetch(
  'http://localhost:5000/api/export-excel',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'multiple',
      data: {
        files: [
          { fileName: 'doc1.pdf', pageCount: 10 },
          { fileName: 'doc2.pdf', pageCount: 20 }
        ],
        totalPages: 30,
        fileCount: 2
      }
    })
  }
);
```

---

### 4. Health Check

**Endpoint**: `GET /api/health`

**Request**: No body required

**Success Response** (200):
```json
{
  "status": "Server is running"
}
```

**cURL Example**:
```bash
curl http://localhost:5000/api/health
```

**JavaScript Example**:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(data => console.log(data.status));
```

---

## 📊 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | File processed successfully |
| 400 | Bad Request | No file provided, invalid format |
| 500 | Server Error | Processing error, disk full |

---

## 📦 Request/Response Headers

### Request Headers (Automatic in most clients)
```
Content-Type: multipart/form-data (for file uploads)
Content-Type: application/json (for JSON data)
```

### Response Headers
```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

---

## 🔒 CORS Configuration

By default, CORS is enabled for all origins. In production, configure for your domain:

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

---

## 📏 Limits & Constraints

| Constraint | Value | Notes |
|-----------|-------|-------|
| Max file size | 50 MB | Per file, configurable |
| Max files per request | Unlimited | Limited by memory |
| Supported format | PDF | Only .pdf MIME type |
| Max PDF pages | N/A | Limited by file size |

---

## 🔄 Complete Workflow Example

### Single PDF Upload & Export

```javascript
// Step 1: Select file
const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];

// Step 2: Upload PDF
const formData = new FormData();
formData.append('file', file);

const uploadResponse = await fetch(
  'http://localhost:5000/api/upload-pdf',
  { method: 'POST', body: formData }
);
const uploadData = await uploadResponse.json();
console.log(`${uploadData.fileName}: ${uploadData.pageCount} pages`);

// Step 3: Export to Excel
const exportResponse = await fetch(
  'http://localhost:5000/api/export-excel',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'single',
      data: {
        fileName: uploadData.fileName,
        pageCount: uploadData.pageCount
      }
    })
  }
);

// Step 4: Download file
const blob = await exportResponse.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `report-${Date.now()}.xlsx`;
a.click();
```

### Multiple PDFs Upload & Export

```javascript
// Step 1: Select multiple files
const files = Array.from(document.getElementById('files-input').files);

// Step 2: Upload multiple PDFs
const formData = new FormData();
files.forEach(file => formData.append('files', file));

const uploadResponse = await fetch(
  'http://localhost:5000/api/process-folder',
  { method: 'POST', body: formData }
);
const uploadData = await uploadResponse.json();
console.log(`Total pages: ${uploadData.totalPages}`);

// Step 3: Export to Excel
const exportResponse = await fetch(
  'http://localhost:5000/api/export-excel',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'multiple',
      data: uploadData
    })
  }
);

// Step 4: Download file
const blob = await exportResponse.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `batch-report-${Date.now()}.xlsx`;
a.click();
```

---

## 🧪 Testing Endpoints

### Using Postman

1. Create new POST request
2. URL: `http://localhost:5000/api/upload-pdf`
3. Body → form-data
4. Key: `file` → Value: Select PDF file
5. Send

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Method: POST
4. URL: `http://localhost:5000/api/upload-pdf`
5. Body → Form data
6. Send

### Using REST Client (VS Code)

Create `test.rest` file:
```
### Upload single PDF
POST http://localhost:5000/api/upload-pdf
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="test.pdf"
Content-Type: application/pdf

< ./sample-pdfs/report-2024.pdf

### Health check
GET http://localhost:5000/api/health
```

---

## 🐛 Debugging Tips

### Enable Verbose Logging (Backend)

```javascript
// backend/server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Network Activity (Frontend)

In browser DevTools:
1. Press F12
2. Go to Network tab
3. Perform action
4. Click request to see details

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 415 Unsupported Media Type | Wrong Content-Type | Use `multipart/form-data` |
| 413 Payload Too Large | File exceeds limit | Use smaller file or increase limit |
| 404 Not Found | Wrong endpoint URL | Check endpoint path |
| CORS Error | Origin not allowed | Enable CORS in backend |

---

## 📚 Related Documentation

- [README.md](./README.md) - Full documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [GETTINGSTARTED.md](./GETTINGSTARTED.md) - Setup guide

---

**Last Updated**: June 2024
**API Version**: 1.0.0
