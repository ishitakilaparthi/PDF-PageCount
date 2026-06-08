# Testing Guide

Complete guide for testing PDF Page Counter application.

## 🧪 Manual Testing

### Prerequisites
- Application running locally
- Sample PDFs in `sample-pdfs/` folder
- Modern web browser

### Test Case 1: Single PDF Upload

**Steps**:
1. Open http://localhost:3000
2. Click "Single PDF"
3. Drag `sample-pdfs/report-2024.pdf` onto upload area
4. Verify page count displays correctly (should be 5)

**Expected Result**:
- ✅ File name shows: "report-2024.pdf"
- ✅ Page count shows: "5"
- ✅ No error messages
- ✅ "Export to Excel" button appears

---

### Test Case 2: Multiple PDFs Upload

**Steps**:
1. Go to http://localhost:3000
2. Click "Multiple PDFs"
3. Select all PDFs from `sample-pdfs/` folder (6 files)
4. Verify results display correctly

**Expected Result**:
- ✅ All 6 files listed in table
- ✅ Individual page counts correct:
  - report-2024.pdf: 5
  - presentation.pdf: 12
  - manual.pdf: 8
  - guide.pdf: 15
  - summary.pdf: 3
  - whitepaper.pdf: 20
- ✅ Total Pages: 63
- ✅ Total Files: 6
- ✅ "Export to Excel" button appears

---

### Test Case 3: Export Single PDF to Excel

**Steps**:
1. Upload single PDF (see Test Case 1)
2. Click "Export to Excel"
3. Verify Excel file downloads
4. Open Excel file and verify content

**Expected Result**:
- ✅ File downloads as `pdf-analysis-[timestamp].xlsx`
- ✅ Excel contains:
  - Header row: "File Name" | "Page Count"
  - Data row: File name | Page count
  - Proper formatting (bold headers)

---

### Test Case 4: Export Multiple PDFs to Excel

**Steps**:
1. Upload multiple PDFs (see Test Case 2)
2. Click "Export to Excel"
3. Verify Excel file downloads
4. Open Excel file and verify content

**Expected Result**:
- ✅ File downloads successfully
- ✅ Excel contains:
  - Header row with bold formatting
  - All 6 files listed
  - TOTAL row: "TOTAL" | "63"
  - TOTAL row has gray background
  - Proper column widths

---

### Test Case 5: Invalid File Upload

**Steps**:
1. Go to http://localhost:3000
2. Click "Single PDF"
3. Try to upload a non-PDF file (e.g., .txt or .jpg)

**Expected Result**:
- ✅ Error message displays: "Only PDF files are allowed"
- ✅ File is not processed
- ✅ Upload area remains accessible

---

### Test Case 6: Drag & Drop Functionality

**Steps**:
1. Go to http://localhost:3000 → Single PDF
2. Drag PDF file over upload area (but don't release)
3. Observe visual feedback
4. Drop the file

**Expected Result**:
- ✅ Upload area highlights/changes appearance on drag
- ✅ File processes on drop
- ✅ Results display correctly

---

### Test Case 7: Process Another Button

**Steps**:
1. Upload and process a PDF
2. Click "Process Another" button
3. Upload a different PDF

**Expected Result**:
- ✅ Returns to upload screen
- ✅ Can upload new file
- ✅ Results clear properly
- ✅ New results display for second file

---

### Test Case 8: Back Button Navigation

**Steps**:
1. From home screen, click "Single PDF"
2. Click "← Back" button
3. Click "Multiple PDFs"
4. Click "← Back" again

**Expected Result**:
- ✅ Navigation works smoothly
- ✅ Returns to home screen each time
- ✅ Can switch between modes

---

### Test Case 9: Responsive Design

**Steps**:
1. Open http://localhost:3000
2. Resize browser window from wide to narrow
3. Test all features at different sizes:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

**Expected Result**:
- ✅ Layout adjusts properly
- ✅ All buttons accessible
- ✅ Text readable
- ✅ Table scrolls on small screens

---

### Test Case 10: Large File Handling

**Steps**:
1. Try to upload a PDF > 50MB
2. Observe response

**Expected Result**:
- ✅ Upload rejected with error
- ✅ Error message indicates file too large

---

## 🔧 API Testing

### Using cURL

```bash
# Test single PDF upload
curl -X POST \
  -F "file=@sample-pdfs/report-2024.pdf" \
  http://localhost:5000/api/upload-pdf

# Test multiple PDFs
curl -X POST \
  -F "files=@sample-pdfs/report-2024.pdf" \
  -F "files=@sample-pdfs/presentation.pdf" \
  http://localhost:5000/api/process-folder

# Test health check
curl http://localhost:5000/api/health
```

### Using Postman

1. Create new request collection
2. Add requests for each endpoint:
   - POST /api/upload-pdf
   - POST /api/process-folder
   - POST /api/export-excel
   - GET /api/health
3. Run requests and verify responses

### Using VS Code REST Client

Create `test.rest`:
```
### Single PDF Upload
POST http://localhost:5000/api/upload-pdf
Content-Type: multipart/form-data; boundary=----

------
Content-Disposition: form-data; name="file"; filename="report.pdf"
Content-Type: application/pdf

< ./sample-pdfs/report-2024.pdf

### Health Check
GET http://localhost:5000/api/health
```

---

## 🔍 Browser DevTools Testing

### Console Tests

```javascript
// Test API directly from console

// Test single upload
const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
formData.append('file', file);

fetch('http://localhost:5000/api/upload-pdf', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(d => console.log(d));

// Test health
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d));
```

### Network Tab

1. Open DevTools → Network tab
2. Clear previous requests
3. Perform action (upload PDF)
4. Observe requests:
   - Request method: POST
   - Status: 200 (success)
   - Response: JSON with page count

---

## 📊 Performance Testing

### Page Load Time
- Expected: < 2 seconds
- Test: Use DevTools → Performance tab
- Click "Start profiling"
- Reload page
- Verify time

### PDF Processing Time
- Single file (5 pages): ~100ms
- Multiple files (50 pages): ~500ms
- Test: Check Console → Timing logs

### Memory Usage
- Idle: ~20-30 MB (React + UI)
- After upload: ~50-100 MB (temporary)
- After processing: ~30-50 MB (cleanup)

---

## 🔒 Security Testing

### File Type Validation
- ✅ Only PDFs accepted
- ❌ Reject .txt, .jpg, .exe, etc.

### File Size Limits
- ✅ Reject files > 50MB
- ✅ Show error message

### CORS Testing
- Verify API accessible from frontend
- Verify proper CORS headers in response

---

## 🐛 Error Scenarios

### Test Error Handling

1. **Server Down**
   - Stop backend server
   - Try to upload
   - Expected: Error message

2. **Invalid PDF**
   - Create empty .pdf file
   - Try to upload
   - Expected: Error or no page count

3. **Network Error**
   - Open DevTools → Network
   - Throttle to "Offline"
   - Try to upload
   - Expected: Network error message

4. **Large Batch**
   - Select 20+ large PDFs
   - Upload and monitor
   - Expected: Processes correctly or shows timeout

---

## 📋 Checklist for Release

- [ ] All manual test cases pass
- [ ] API endpoints return correct responses
- [ ] Excel export works and is formatted correctly
- [ ] Error messages display properly
- [ ] Responsive design works on all screen sizes
- [ ] Performance is acceptable (< 2s load time)
- [ ] Security validations in place
- [ ] Browser compatibility tested:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Mobile testing completed
- [ ] Accessibility verified
- [ ] Documentation is accurate
- [ ] Sample PDFs included and working
- [ ] Deployment tested

---

## 🚀 Automated Testing (Future)

### Suggested Tools
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **Artillery** - Load testing

### Example Test Cases

```javascript
// Jest test example
describe('PDF Upload', () => {
  test('should upload PDF and get page count', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData
    });
    
    expect(response.status).toBe(200);
  });
});
```

---

## 📞 Troubleshooting Tests

If a test fails:

1. **Check Console**: Look for error messages
2. **Check Backend Logs**: Verify server is running
3. **Check Network**: Open DevTools → Network tab
4. **Verify Files**: Ensure sample PDFs exist
5. **Check Ports**: Verify 5000 and 3000 are available
6. **Clear Cache**: Browser cache might cause issues

---

**Last Updated**: June 2024
**Test Coverage**: Comprehensive manual testing guide
