# Deployment Guide

Complete guide to deploy PDF Page Counter to production.

## Table of Contents
1. [Heroku](#heroku)
2. [Vercel + Railway](#vercel--railway)
3. [Netlify + Render](#netlify--render)
4. [DigitalOcean](#digitalocean)
5. [AWS](#aws)
6. [Self-Hosted](#self-hosted)

## Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Deploy Backend

```bash
cd backend
heroku login
heroku create pdf-counter-backend
git push heroku main
heroku ps:scale web=1
heroku logs --tail
```

### Deploy Frontend

```bash
cd frontend
# Update API endpoint in src/App.js or use environment variables
REACT_APP_API_URL=https://pdf-counter-backend.herokuapp.com npm run build
vercel
```

**Note:** Heroku free tier has been deprecated. Use paid dynos or alternative platforms.

## Vercel + Railway

### Frontend (Vercel)

```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts and deploy
```

### Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository (backend folder)
4. Add environment variables:
   - `NODE_ENV: production`
5. Deploy

**Update frontend .env:**
```
REACT_APP_API_URL=https://your-railway-url.railway.app
```

## Netlify + Render

Complete free deployment solution: **Netlify** (Frontend) + **Render** (Backend)

### Step 1: Prepare Your Project

Push your project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/PDF-PageCount.git
git push -u origin main
```

### Backend Deployment (Render)

#### Prerequisites
- Render account (free at [render.com](https://render.com))
- GitHub repository connected to your Render account

#### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repository (PDF-PageCount)
4. Fill in the configuration:
   - **Name:** `pdf-counter-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`
   - **Branch:** main
   - **Instance Type:** Free (default)

5. Click **"Create Web Service"**
6. Wait for deployment (2-3 minutes)
7. Copy your backend URL (e.g., `https://pdf-counter-backend.onrender.com`)

#### Step 3: Configure Backend Environment

1. In Render dashboard, go to your web service
2. Click **"Environment"** tab
3. Add environment variables (optional):
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
4. Click **"Save"**

⚠️ **Note:** Render free tier spins down after 15 minutes of inactivity. It will restart automatically when accessed (takes 30 seconds).

### Frontend Deployment (Netlify)

#### Prerequisites
- Netlify account (free at [netlify.com](https://netlify.com))

#### Step 4: Update Frontend API URL

Edit `frontend/src/App.js` and update the API URLs:

```javascript
// Add this at the top of App.js or in a .env file
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://pdf-counter-backend.onrender.com
```

Update all axios calls in components to use the environment variable. For example, in `SinglePDF.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const response = await axios.post(
  `${API_URL}/api/upload-pdf`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

Repeat for all three components:
- `frontend/src/components/SinglePDF.js`
- `frontend/src/components/MultiplePDF.js`
- `frontend/src/components/FolderUpload.js`

#### Step 5: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repository
4. Choose **GitHub** as the Git provider
5. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`

6. Add Environment Variables:
   - Click **"Advanced"** → **"New variable"**
   - Key: `REACT_APP_API_URL`
   - Value: `https://pdf-counter-backend.onrender.com`
   - Click **"Save"**

7. Click **"Deploy site"**
8. Wait for build completion (1-2 minutes)
9. Your site will be available at a Netlify URL (e.g., `https://pdf-counter.netlify.app`)

### Step 6: Test Your Deployment

1. Visit your Netlify frontend URL
2. Test all three modes:
   - **Single PDF:** Upload one PDF, verify page count
   - **Multiple PDFs:** Upload several PDFs, verify counts and total
   - **Folder Upload:** Select a folder with PDFs, verify all process
3. Test Excel export from each mode
4. Verify "Process Another" button works without errors

### Subsequent Deployments

**Automatic:** Both Netlify and Render auto-deploy when you push to GitHub
```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Manual:** 
- Netlify: Dashboard → **"Deploys"** → **"Trigger deploy"**
- Render: Dashboard → **"Manual Deploy"** → **"Deploy latest commit"**

### Troubleshooting

**CORS Error in Production?**
Update backend `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-netlify-url.netlify.app', 'http://localhost:3000']
}));
```

**Large File Uploads Failing?**
Increase payload limit in `backend/server.js`:
```javascript
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
```

**Backend Takes 30 Seconds to Start?**
This is normal on Render's free tier after inactivity. The app will automatically wake up.

**Files Uploading But Not Processing?**
Verify environment variable `REACT_APP_API_URL` is set correctly in Netlify environment variables.

### Performance Tips

1. **First Load**: Add loading indicators (already implemented)
2. **File Sizes**: Keep PDFs under 50MB each
3. **Caching**: Netlify automatically caches static files
4. **Backend Optimization**: Render free tier has 512MB RAM - suitable for typical usage

### Cost Summary

| Service | Cost | Limits |
|---------|------|--------|
| Netlify Frontend | FREE | 100 GB/month bandwidth |
| Render Backend | FREE | $0.002/hour compute (minimal) |
| **Total** | **FREE** | Suitable for development/testing |



## DigitalOcean

### Using App Platform

1. Create new app on DigitalOcean
2. Connect GitHub
3. Configure backend service:
   - Source: Select backend folder
   - Runtime: Node.js
4. Configure frontend service:
   - Source: Select frontend folder
   - Build command: `npm run build`
   - Output directory: `build`
4. Deploy

### Using Droplet (VPS)

**SSH into your droplet:**
```bash
ssh root@your_droplet_ip
```

**Update system:**
```bash
apt update && apt upgrade -y
apt install -y nodejs npm git
```

**Clone repository:**
```bash
git clone https://github.com/yourusername/PDF-PageCount.git
cd PDF-PageCount
```

**Install and run backend:**
```bash
cd backend
npm install
npm install -g pm2
pm2 start server.js --name pdf-backend
pm2 save
```

**Build and configure frontend:**
```bash
cd ../frontend
npm install
npm run build
npm install -g serve
pm2 start "serve -s build -l 3000" --name pdf-frontend
```

**Setup Nginx reverse proxy:**
```bash
apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
upstream backend {
    server localhost:5000;
}

server {
    server_name your_domain.com;
    
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

**Enable SSL (Let's Encrypt):**
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

## AWS

### Using Elastic Beanstalk

**Backend:**
```bash
cd backend
eb init
eb create pdf-counter-env
eb deploy
```

**Frontend:**
```bash
cd frontend
npm run build
aws s3 mb s3://pdf-counter-frontend
aws s3 sync build/ s3://pdf-counter-frontend/
aws s3 website s3://pdf-counter-frontend \
    --index-document index.html \
    --error-document index.html
```

### Using EC2

1. Launch Ubuntu 20.04 LTS instance
2. Security group: Allow ports 22, 80, 443, 5000, 3000
3. SSH into instance:

```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repo, install, and run
git clone https://github.com/yourusername/PDF-PageCount.git
cd PDF-PageCount/backend
npm install
node server.js &

# In another terminal
cd PDF-PageCount/frontend
npm install
npm run build
serve -s build -p 80 &
```

## Self-Hosted

### Docker

**Dockerfile for backend:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 5000
CMD ["node", "server.js"]
```

**Dockerfile for frontend:**
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

Run with:
```bash
docker-compose up -d
```

### Without Docker

**On Linux/Mac:**

```bash
# Backend
cd backend
nohup npm start > backend.log 2>&1 &

# Frontend
cd frontend
npm run build
nohup serve -s build -l 3000 > frontend.log 2>&1 &
```

**Process management with PM2:**
```bash
npm install -g pm2

pm2 start backend/server.js --name pdf-backend
pm2 start "serve -s frontend/build -p 3000" --name pdf-frontend
pm2 save
pm2 startup
```

## Environment Variables

Create `.env` files:

**Backend .env:**
```
PORT=5000
NODE_ENV=production
```

**Frontend .env:**
```
REACT_APP_API_URL=https://your-api-domain.com
```

## Monitoring & Maintenance

### Logs
- Heroku: `heroku logs --tail`
- PM2: `pm2 logs`
- Docker: `docker logs container-name`

### Updates
```bash
git pull origin main
npm install
npm run build
# Restart services
```

### Backup
```bash
# Backup uploads and exports
tar -czf backup-$(date +%Y%m%d).tar.gz backend/uploads backend/exports
```

## Performance Optimization

1. **Enable Gzip compression** in backend
2. **Use CDN** for frontend assets (CloudFlare)
3. **Enable caching** for static files
4. **Use Node.js clustering** for backend
5. **Implement rate limiting** to prevent abuse

## Troubleshooting

**CORS errors in production?**
Update backend CORS:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

**Large file uploads failing?**
Increase payload size in backend:
```javascript
app.use(express.json({ limit: '100mb' }));
```

**Out of memory?**
Increase Node.js memory:
```bash
node --max-old-space-size=4096 server.js
```

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Validate all file uploads
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection
- [ ] Set up automated backups
- [ ] Monitor server logs
- [ ] Keep dependencies updated
