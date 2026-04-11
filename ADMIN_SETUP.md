# Admin Panel Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Create .env file
Copy `.env.example` to `.env` and fill in:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myfolio
JWT_SECRET=generate-a-random-secret-key-here
SETUP_KEY=your-one-time-setup-key
```

## Step 3: Create Admin User (One-time)
Use this curl command or Postman:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aryan.dev",
    "password": "your-secure-password",
    "name": "Aryan",
    "setupKey": "your-one-time-setup-key"
  }'
```

## Step 4: Test Locally
```bash
npm run dev
```
Visit: http://localhost:3000/admin/login.html

## Step 5: Deploy to Vercel
```bash
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard:
- MONGODB_URI
- JWT_SECRET
- SETUP_KEY

## Admin Panel URLs
- Login: /admin/login.html
- Dashboard: /admin/dashboard.html
- Projects: /admin/projects.html
- Skills: /admin/skills.html
- Profile: /admin/profile.html

## API Endpoints
- POST /api/auth/login
- POST /api/auth/register (protected by SETUP_KEY)
- GET /api/projects (public)
- POST /api/projects (protected)
- PUT /api/projects/:id (protected)
- DELETE /api/projects/:id (protected)
- GET /api/skills (public)
- PUT /api/skills (protected)
- GET /api/profile (public)
- PUT /api/profile (protected)

## Next Steps
1. Create remaining admin pages (projects.html, skills.html, profile.html)
2. Connect frontend to fetch data from API
3. Add image upload functionality (optional)
4. Add analytics (optional)
