# ARYAN — Portfolio

A modern, cyberpunk-themed developer portfolio with real-time admin panel and dynamic content management.

## 🚀 Live Demo

- **Portfolio**: https://aryanfolio.vercel.app

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

## 🎯 Project Structure

```
myfolio/
├── frontend/              # Frontend application
│   ├── admin/            # Admin panel pages
│   ├── index.html        # Main portfolio page
│   ├── style.css         # Main styles
│   ├── script.js         # Main JavaScript
│   └── config.js         # API configuration
├── backend/              # Backend API
│   ├── api/             # Serverless API routes
│   ├── lib/             # Utilities
│   ├── package.json
│   └── vercel.json      # Vercel configuration
└── README.md
```

## 📡 API Endpoints

### Public
- `GET /api/projects` - Get all projects
- `GET /api/skills` - Get all skills
- `GET /api/profile` - Get profile data
- `GET /api/status` - Get online status

### Protected (Requires JWT)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/skills` - Update skills
- `PUT /api/profile` - Update profile
- `PUT /api/status` - Update status

## 📝 License

MIT License

## 📧 Contact

- GitHub: [@imaryannn](https://github.com/imaryannn)
- LinkedIn: [Aryan](https://www.linkedin.com/in/aryan-2064153a0/)
- Portfolio: [aryanfolio.vercel.app](https://aryanfolio.vercel.app)

---

Built with 💻 by Aryan
