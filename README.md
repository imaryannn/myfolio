# ARYAN — Portfolio

A modern, cyberpunk-themed developer portfolio with real-time admin panel and dynamic content management.

## 🚀 Live Demo

- **Portfolio**: https://aryanfolio.vercel.app
- **Admin Panel**: https://aryanfolio.vercel.app/admin/login.html
- **Backend API**: https://backendaryanfolio.vercel.app

## ✨ Features

- **Interactive Terminal UI** - Bootable terminal with command-line interface
- **Smooth Parallax Scrolling** - GSAP-powered animations and Lenis smooth scroll
- **Admin Dashboard** - Full CRUD operations for projects, skills, and profile
- **Real-time Updates** - Dynamic content loading from MongoDB
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Secure Authentication** - JWT-based admin authentication

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- GSAP & ScrollTrigger for animations
- Lenis for smooth scrolling
- Web3Forms for contact form
- Deployed on Vercel

### Backend
- Node.js & Express.js (Serverless Functions)
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture
- Deployed on Vercel

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/imaryannn/myfolio.git
cd myfolio
```

2. Setup Backend:
```bash
cd backend
npm install
```

3. Create `backend/.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SETUP_KEY=your_setup_key_for_registration
```

4. Setup Frontend:
```bash
cd ../frontend
```

5. Update `frontend/config.js` for local development:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

## 🎯 Project Structure

```
myfolio/
├── frontend/              # Frontend application
│   ├── admin/            # Admin panel pages
│   │   ├── dashboard.html
│   │   ├── projects.html
│   │   ├── skills.html
│   │   ├── profile.html
│   │   ├── login.html
│   │   ├── admin-style.css
│   │   └── admin.js
│   ├── index.html        # Main portfolio page
│   ├── style.css         # Main styles
│   ├── script.js         # Main JavaScript
│   ├── config.js         # API configuration
│   └── lenis.min.js      # Smooth scroll library
├── backend/              # Backend API
│   ├── api/             # Serverless API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── projects/    # Projects CRUD
│   │   ├── skills/      # Skills management
│   │   ├── profile/     # Profile management
│   │   └── status/      # Online status
│   ├── lib/             # Utilities
│   │   ├── auth.js      # JWT middleware
│   │   └── mongodb.js   # Database connection
│   ├── package.json
│   └── vercel.json      # Vercel configuration
└── README.md
```

## 🔑 Admin Access

1. Navigate to `/admin/login.html`
2. Login with admin credentials
3. Manage projects, skills, and profile from the dashboard

### Admin Features:
- **Projects Management** - Add, edit, delete projects
- **Skills Management** - Update skill categories and levels
- **Profile Management** - Edit hero, about, and contact info
- **Status Toggle** - Set online/offline status

## 🎨 Customization

### Colors
Edit CSS variables in `frontend/style.css`:
```css
:root {
    --bg-primary: #050506;
    --accent-copper: #ff6e27;
    --accent-cyan: #00f0ff;
}
```

### Terminal Commands
Add custom commands in `frontend/script.js`:
```javascript
switch(val) {
    case 'yourcommand':
        response.textContent = 'Your response';
        break;
}
```

## 📡 API Endpoints

### Public
- `GET /api/projects` - Get all projects
- `GET /api/skills` - Get all skills
- `GET /api/profile` - Get profile data
- `GET /api/status` - Get online status

### Protected (Requires JWT)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (requires SETUP_KEY)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/skills` - Update skills
- `PUT /api/profile` - Update profile
- `PUT /api/status` - Update status

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Deploy

### Backend (Vercel)
1. Import project in Vercel
2. Set root directory to `backend`
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `SETUP_KEY`
4. Deploy

### Update API URL
After backend deployment, update `frontend/config.js`:
```javascript
const API_BASE_URL = 'https://your-backend.vercel.app';
```

## 📝 License

MIT License - feel free to use this project for your own portfolio

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

- GitHub: [@imaryannn](https://github.com/imaryannn)
- LinkedIn: [Aryan](https://www.linkedin.com/in/aryan-2064153a0/)
- Portfolio: [aryanfolio.vercel.app](https://aryanfolio.vercel.app)

---

Built with 💻 by Aryan
