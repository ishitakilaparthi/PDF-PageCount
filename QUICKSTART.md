# Quick Start Guide

Get the PDF Page Counter running in 5 minutes!

## Step 1: Create Sample PDFs (Optional but Recommended)

```bash
cd PDF-PageCount
python create_sample_pdfs.py
```

## Step 2: Start Backend Server

```bash
cd backend
npm install
npm start
```

Wait for: `Server running on http://localhost:5000`

## Step 3: Start Frontend Application (New Terminal)

```bash
cd frontend
npm install
npm start
```

The application will automatically open at `http://localhost:3000`

## Step 4: Use the Application

### Test Single PDF:
1. Click "Single PDF"
2. Upload any PDF from your computer or use sample PDFs
3. View page count
4. Click "Export to Excel" to download results

### Test Multiple PDFs:
1. Click "Multiple PDFs"
2. Upload multiple PDFs at once
3. View summary with total pages
4. Export to Excel spreadsheet

## Troubleshooting

**Backend won't start?**
```bash
npm install --legacy-peer-deps
npm start
```

**Frontend won't start?**
```bash
npm cache clean --force
npm install
npm start
```

**Port 5000 in use?**
```bash
# Find process using port 5000
lsof -i :5000
kill -9 <PID>
```

**Port 3000 in use?**
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :3000
kill -9 <PID>
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting options
- Customize UI by editing files in `frontend/src/components/`
- Modify API settings in `backend/server.js`
