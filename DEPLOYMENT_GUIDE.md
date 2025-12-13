# ChabakaPro - Complete Deployment Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Running the Application](#running-the-application)
5. [Deployment Process](#deployment-process)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### Components
- **Frontend**: React 18 + Tailwind CSS (Deployed on GitHub Pages)
- **Backend**: Node.js + Express + MongoDB (Running locally with Docker)
- **Database**: MongoDB 7.0 (Docker container)
- **Tunnel**: Cloudflare Tunnel (Exposes local backend to internet)

### Architecture Diagram
```
Internet
    ↓
GitHub Pages (https://www.chabakapro.com)
    ↓
Cloudflare Tunnel (https://xxx.trycloudflare.com)
    ↓
Local Backend (Docker - port 5001)
    ↓
MongoDB (Docker - port 27017)
```

---

## 🔧 Prerequisites

### Software Requirements
- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- Cloudflare Tunnel (`cloudflared`)

### Accounts Required
- GitHub account (for repository and Pages)
- MongoDB Atlas account (optional, for cloud database)
- Domain registrar access (for DNS configuration)

---

## 🚀 Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/abdo342003/ChabakaPro.git
cd ChabakaPro
```

### 2. Configure DNS Records

At your domain registrar, add these DNS records:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| CNAME | www  | abdo342003.github.io     |
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |

### 3. Enable GitHub Pages

1. Go to: `https://github.com/abdo342003/ChabakaPro/settings/pages`
2. Under **"Build and deployment"**:
   - Source: Select **"GitHub Actions"**
3. Under **"Custom domain"**:
   - Enter: `www.chabakapro.com`
   - Check **"Enforce HTTPS"**

### 4. Install Cloudflare Tunnel

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

---

## 🏃 Running the Application

### Step 1: Start Backend Services

```bash
cd ~/Desktop/OurProject

# Start MongoDB and Backend with Docker
docker-compose up -d mongodb backend

# Verify services are running
docker-compose ps
```

Expected output:
```
chabakapro_backend    Up    0.0.0.0:5001->5000/tcp
chabakapro_mongodb    Up    0.0.0.0:27017->27017/tcp
```

### Step 2: Start Cloudflare Tunnel

```bash
# Start tunnel in background
nohup cloudflared tunnel --url http://localhost:5001 > /tmp/cloudflared.log 2>&1 &

# Get the public URL (wait 5 seconds for tunnel to start)
sleep 5
cat /tmp/cloudflared.log | grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" | head -1
```

**Example output:**
```
https://church-pushed-mere-annually.trycloudflare.com
```

⚠️ **Save this URL** - you'll need it for deployment!

### Step 3: Update GitHub Actions with Tunnel URL

Edit `.github/workflows/deploy.yml`:

```yaml
- name: Build
  working-directory: ./frontend
  run: npm run build
  env:
    CI: false
    PUBLIC_URL: /
    REACT_APP_API_URL: https://YOUR-TUNNEL-URL.trycloudflare.com/api  # ← Update this
    REACT_APP_WHATSAPP_NUMBER: 212600000000
    REACT_APP_PHONE_NUMBER: +212600000000
    REACT_APP_EMAIL: contact@techsolutions-casa.ma
```

### Step 4: Deploy Frontend

```bash
git add .github/workflows/deploy.yml
git commit -m "Update tunnel URL for deployment"
git push origin main
```

Wait 2-3 minutes for GitHub Actions to build and deploy.

### Step 5: Verify Deployment

- Check Actions: `https://github.com/abdo342003/ChabakaPro/actions`
- Visit site: `https://www.chabakapro.com`

---

## 🔄 Deployment Process

### Automatic Deployment (Recommended)

GitHub Actions automatically deploys on every push to `main`:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to: `https://github.com/abdo342003/ChabakaPro/actions`
   - Wait 2-3 minutes for build to complete

3. **Verify:**
   - Visit `https://www.chabakapro.com`
   - Do hard refresh: `Ctrl + Shift + R`

### Manual Local Testing

Test locally before deploying:

```bash
# Start all services locally
docker-compose up -d

# Access:
# - Frontend: http://localhost:4000
# - Backend: http://localhost:5001/api
# - MongoDB: mongodb://localhost:27017
```

---

## 🛠️ Maintenance

### Daily Operations

#### 1. Check Services Status
```bash
docker-compose ps
```

#### 2. View Logs
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# All logs
docker-compose logs -f
```

#### 3. Restart Services
```bash
# Restart specific service
docker-compose restart backend

# Restart all services
docker-compose restart
```

### Backend Development (Live Reload)

The backend uses **nodemon** for automatic restart on file changes:

1. Edit any file in `backend/src/`
2. Nodemon automatically detects changes and restarts
3. Check logs: `docker-compose logs -f backend`

**No rebuild needed!** Changes are instant thanks to volume mounting.

### Updating Dependencies

#### Backend
```bash
cd backend
npm install new-package
docker-compose restart backend
```

#### Frontend
```bash
cd frontend
npm install new-package
# Rebuild required
docker-compose up --build -d frontend
# Or push to trigger GitHub Actions build
```

### Database Management

#### Backup MongoDB
```bash
docker exec chabakapro_mongodb mongodump --out=/tmp/backup
docker cp chabakapro_mongodb:/tmp/backup ./mongodb-backup
```

#### Restore MongoDB
```bash
docker cp ./mongodb-backup chabakapro_mongodb:/tmp/backup
docker exec chabakapro_mongodb mongorestore /tmp/backup
```

---

## 🐛 Troubleshooting

### Issue 1: Backend Connection Refused

**Symptoms:**
```
ERR_CONNECTION_REFUSED to localhost:5001
```

**Solution:**
```bash
# Check if backend is running
docker-compose ps backend

# If not running, start it
docker-compose up -d backend

# Check logs for errors
docker-compose logs backend
```

### Issue 2: Cloudflare Tunnel Not Working

**Symptoms:**
```
502 Bad Gateway from tunnel URL
```

**Solution:**
```bash
# Check if tunnel is running
ps aux | grep cloudflared

# Kill old tunnels
pkill cloudflared

# Restart tunnel
nohup cloudflared tunnel --url http://localhost:5001 > /tmp/cloudflared.log 2>&1 &

# Get new URL
sleep 5
cat /tmp/cloudflared.log | grep -oE "https://[a-z0-9-]+\.trycloudflare\.com"

# Update .github/workflows/deploy.yml with new URL
# Commit and push
```

### Issue 3: CORS Errors

**Symptoms:**
```
Access-Control-Allow-Origin error in browser console
```

**Solution:**

Edit `backend/src/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://www.chabakapro.com',
    'https://chabakapro.com',
    'http://localhost:3000',
    'http://localhost:4000'
  ],
  credentials: true
}));
```

Changes auto-reload with nodemon!

### Issue 4: Frontend Shows Blank Page

**Symptoms:**
- White screen on chabakapro.com
- 404 errors for JS/CSS files

**Solution:**
```bash
# Check GitHub Actions build logs
# Ensure PUBLIC_URL is set correctly in .github/workflows/deploy.yml

env:
  PUBLIC_URL: /

# Hard refresh browser: Ctrl + Shift + R
```

### Issue 5: MongoDB Connection Failed

**Symptoms:**
```
MongoNetworkError: connect ECONNREFUSED
```

**Solution:**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Issue 6: Tunnel URL Changes

⚠️ **Important:** Cloudflare Tunnel URL changes every time cloudflared restarts!

**Solution:**
1. Get new URL: `cat /tmp/cloudflared.log | grep trycloudflare.com`
2. Update `.github/workflows/deploy.yml`
3. Commit and push

**For permanent solution:** Set up a named Cloudflare Tunnel with custom subdomain.

---

## 📊 Monitoring & Analytics

### Check Website Status
```bash
# Test website accessibility
curl -I https://www.chabakapro.com

# Test API through tunnel
curl https://YOUR-TUNNEL-URL.trycloudflare.com/api/portfolio
```

### GitHub Actions Status

Monitor deployments:
- URL: `https://github.com/abdo342003/ChabakaPro/actions`
- Each push triggers automatic deployment
- Build time: ~2-3 minutes

### Docker Resource Usage
```bash
# Check container stats
docker stats

# Check disk usage
docker system df
```

---

## 🔐 Security Best Practices

### 1. Environment Variables

Never commit sensitive data! Use environment variables:

```bash
# Create backend/.env (NOT committed to Git)
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-key
EMAIL_PASS=your-email-app-password
```

### 2. MongoDB Security

- ✅ Use strong passwords
- ✅ Enable IP whitelist in MongoDB Atlas
- ✅ Use connection strings with authentication

### 3. HTTPS

- ✅ Enforce HTTPS on GitHub Pages
- ✅ Cloudflare Tunnel provides automatic HTTPS

---

## 📝 Quick Reference

### Common Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild frontend
docker-compose up --build -d frontend

# View logs (follow mode)
docker-compose logs -f

# Restart backend only
docker-compose restart backend

# Deploy to production
git push origin main

# Start Cloudflare Tunnel
cloudflared tunnel --url http://localhost:5001
```

### Important URLs

| Service           | URL                                          |
|-------------------|----------------------------------------------|
| Production Site   | https://www.chabakapro.com                   |
| GitHub Repository | https://github.com/abdo342003/ChabakaPro     |
| GitHub Pages      | https://abdo342003.github.io/ChabakaPro      |
| GitHub Actions    | (repo)/actions                               |
| Local Frontend    | http://localhost:4000                        |
| Local Backend     | http://localhost:5001/api                    |

### Port Reference

| Port  | Service           | Access                    |
|-------|-------------------|---------------------------|
| 4000  | Frontend (nginx)  | http://localhost:4000     |
| 5001  | Backend API       | http://localhost:5001/api |
| 27017 | MongoDB           | mongodb://localhost:27017 |

---

## 🎯 Workflow Summary

### Daily Development Workflow

1. **Start services:**
   ```bash
   docker-compose up -d
   cloudflared tunnel --url http://localhost:5001
   ```

2. **Develop locally:**
   - Edit backend files → Auto-reload with nodemon
   - Test at http://localhost:4000

3. **Deploy to production:**
   ```bash
   git add .
   git commit -m "Feature: description"
   git push origin main
   ```

4. **Verify deployment:**
   - Check GitHub Actions
   - Visit https://www.chabakapro.com

### Before Shutting Down

```bash
# Stop services
docker-compose down

# Kill tunnel
pkill cloudflared
```

---

## 📞 Support

For issues or questions:
- Email: contact@chabakapro.com
- GitHub Issues: https://github.com/abdo342003/ChabakaPro/issues

---

**Document Version:** 1.0  
**Last Updated:** December 13, 2025  
**Maintainer:** ChabakaPro Team
