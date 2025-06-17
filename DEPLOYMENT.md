# Deployment Guide - Brasil Cultural Agency

## Quick Deploy to Replit

The application is already configured to run on Replit. Simply click the **Deploy** button in the Replit interface to make it publicly available.

## Manual GitHub Repository Setup

Since there are git lock issues in the current environment, follow these steps to create your GitHub repository:

### Step 1: Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" button and select "New repository"
3. Name it: `brasil-cultural-agency`
4. Add description: "AI-Powered Travel Platform for Brazilian Cultural Experiences"
5. Keep it public
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### Step 2: Download Project Files
From Replit, download these key files to your local machine:
- All files in the project directory
- Make sure to exclude `.replit` and `.config` folders

### Step 3: Initialize Local Repository
```bash
# In your local project directory
git init
git add .
git commit -m "Initial commit: Brasil Cultural Agency travel platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/brasil-cultural-agency.git
git push -u origin main
```

### Step 4: Environment Variables for Production
Create these environment variables in your deployment platform:

```env
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Production Deployment Options

### Option 1: Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Option 2: Railway
1. Connect GitHub repository to Railway
2. Add environment variables
3. Railway will auto-deploy

### Option 3: Render
1. Connect GitHub repository to Render
2. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `npm run dev`
3. Add environment variables

## Database Migration (Future)
When ready to use PostgreSQL:
1. Update `DATABASE_URL` environment variable
2. Run database migrations
3. Update storage implementation

## Features Ready for Production
- AI chat system with profile detection
- Admin dashboard with authentication
- Travel package management
- Lead generation and email capture
- Responsive design
- Error handling and logging