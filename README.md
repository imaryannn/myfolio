# ARYAN — Portfolio

A modern, cyberpunk-themed developer portfolio with real-time admin panel and dynamic content management.

## 🚀 Features

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

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/myfolio.git
cd myfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

4. Start the server:
```bash
npm start
```

5. Open `index.html` in your browser or use a local server

## 🎯 Project Structure

```
myfolio/
├── admin/              # Admin panel pages
│   ├── dashboard.html
│   ├── projects.html
│   ├── skills.html
│   ├── profile.html
│   ├── login.html
│   ├── admin-style.css
│   └── admin.js
├── api/                # API routes
│   ├── auth/
│   ├── projects/
│   ├── skills/
│   └── profile/
├── lib/                # Utilities
│   ├── auth.js
│   └── mongodb.js
├── models/             # Database models
├── index.html          # Main portfolio page
├── style.css           # Main styles
├── script.js           # Main JavaScript
├── server.js           # Express server
└── package.json
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
Edit CSS variables in `style.css`:
```css
:root {
    --bg-primary: #050506;
    --accent-copper: #ff6e27;
    --accent-cyan: #00f0ff;
    /* ... */
}
```

### Terminal Commands
Add custom commands in `script.js`:
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
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/skills` - Update skills
- `PUT /api/profile` - Update profile
- `PUT /api/status` - Update status

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or GitHub Pages

### Backend
Deploy to Render, Railway, or Heroku

Update API URLs in:
- `script.js` (line ~700)
- `admin/admin.js`
- All admin HTML files

## 📝 License

MIT License - feel free to use this project for your own portfolio

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

- GitHub: [@imaryannn](https://github.com/imaryannn)
- LinkedIn: [Aryan](https://www.linkedin.com/in/aryan-2064153a0/)

---

Built with 💻 by Aryan
