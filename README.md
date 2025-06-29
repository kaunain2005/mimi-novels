# 🌸 Mimi-Novels

> **Version 3.0.0** — Gravity Flowers, Matter.js Physics & Polished Experience

---

## ✨ About

**Mimi-Novels** is a beautiful, animated, flower-themed web app for reading and exploring PDF novels online.  
It combines:

- 📚 **A curated library of novels**
- 🌸 **Gravity Flowers background** for aesthetic calm
- ⚙️ **Matter.js physics** — flowers react with real-world motion & device tilt
- 🔒 **Secure auth** with Firebase (Login/Register)
- 🛡️ **Protected routes** — admin-only pages
- 🎨 **Modern UI** — GSAP animations, soft blur overlays, smooth transitions
- ✅ Deployed on **Vercel**

---

## 📌 Features

- 🌟 **Login/Register** with Firebase Auth
- 🌟 **Store user names** in Firestore
- 🌟 **Admin privileges** — protect `/admin` with role-based auth
- 🌟 **Animated Navbar** with spinning flower logo
- 🌟 **Home page library** with responsive cards
- 🌟 **404 page** with real gravity flower physics that react to clicks & device tilt
- 🌟 **Fancy Loader** for smooth experience

---

## 🗂️ Tech Stack

- **Frontend:** React + Vite + TailwindCSS + GSAP + Matter.js
- **Backend:** Firebase Auth & Firestore
- **Deploy:** Vercel

---

## 🚀 Getting Started

1️⃣ **Clone this repo**

```bash
git clone https://github.com/YOUR_USERNAME/mimi-novels.git
cd mimi-novels
2️⃣ Install dependencies

npm install

3️⃣ Setup Firebase

Create a Firebase project

Enable Auth (Email/Password)

Create Firestore Database

Add your Admin Email to Firestore under admin collection

4️⃣ Add your Firebase config

Create .env file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

5️⃣ Run locally

npm run dev

📁 Folder Structure
📂 src
 ├─ 📂 auth        # Login, Register, ProtectedRoute
 ├─ 📂 components  # Navbar, GravityFlowers, Modal, Layout, FancyLoader
 ├─ 📂 pages       # Home, Admin, Reader, NotFound
 ├─ firebase.js    # Firebase config & exports
 ├─ App.jsx
 └─ main.jsx

👑 Admin Access
✅ Only the admin can access /admin route.

✨ Special Thanks
Built with:
🌸 Flowers for calm
☁️ Cloud Firestore for easy storage
⚡ GSAP & Matter.js for smooth animations

❤️ Vercel for frictionless deploys

📌 License
Open-source for learning & inspiration — feel free to fork, remix & grow your own 🌱.

🌐 Live Demo
👉 <a href="https://mimi-novels.vercel.app/">View Live on Vercel<a/>

🤝 Contribute
Feel free to:

⭐ Star the repo
🐛 Report bugs
💡 Suggest improvements
📖 Add books!
📬 Contact

Made with ❤️ by Kaunain