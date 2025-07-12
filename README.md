# Odoo-hackathon-nakul-tanuja

Problem Statement :- Skill Swap Platform <br>
Team Member Names :- 1) Nakul Maheshwari <br>
                     2) Tanuja <br>
Email Address:- 1) nakulths@gmail.com (Nakul) <br>
                2) 1803tanuja@gmail.com (Tanuja) <br>

Video Demo Link :- https://drive.google.com/file/d/1KByX-F6Q2eUl4DtzAbpf2d7tlnEQg3T8/view?usp=sharing
<br>
<br>
<br>

# 🔄 Skill Swap Platform

A full-stack web application that enables users to **offer and request skills** from each other, facilitating a community-driven skill-sharing environment. Built with **Node.js**, **Express**, **React**, and **PostgreSQL**.

---

## 🗂️ Project Structure

skill-swap-backend/<br>
├── routes/<br>
├── uploads/<br>
├── db.js<br>
├── server.js<br>
├── .env<br>
├── package.json<br>
├── skill_user.sql  <-- Database schema<br>
└── node_modules/   <-- (Already uploaded)<br><br>
skill-swap-frontend/<br>
├── src/<br>
├── public/<br>
├── package.json<br>
└── node_modules/   <-- (Already uploaded)<br>


---

## 🚀 Tech Stack

- **Frontend**: React, Axios, CSS
- **Backend**: Node.js, Express.js, PostgreSQL
- **Database**: PostgreSQL (with pg package)
- **Auth**: JWT-based Authentication
- **File Uploads**: Multer
- **Deployment Ready**: Localhost or can be deployed to Vercel/Render

---

## 🛠️ Setup Instructions

> ⚠️ **Node modules are already uploaded**, so `npm install` is optional if not modifying dependencies.

---

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/skill-swap-platform.git
cd skill-swap-platform
2️⃣ Setup PostgreSQL Database
Open pgAdmin or connect to your PostgreSQL server.

Create a new user and database:

Username: skill_user

Password: yourpassword

Database: skill_swap_db

Run the provided SQL file to create the tables:


-- In pgAdmin query tool or psql terminal:
-- skill-swap-backend/skill_user.sql
3️⃣ Configure Environment Variables
In skill-swap-backend/.env:

env
PG_USER=skill_user
PG_HOST=localhost
PG_DATABASE=skill_swap_db
PG_PASSWORD=yourpassword
PG_PORT=5432
JWT_SECRET=mySuperSecretKey123
4️⃣ Run the Backend

cd skill-swap-backend
node server.js
📍 Backend runs at: http://localhost:5000

5️⃣ Run the Frontend

cd skill-swap-frontend
npm start
📍 Frontend runs at: http://localhost:3000

🔐 Admin Access
When registering a user via SQL or manually, set:


UPDATE users SET is_admin = TRUE WHERE id = 1;
Then login → you'll be able to access the Admin Panel.

✅ Features
🔐 JWT-based Authentication

👤 User Profiles with photo, skills, availability

🔄 Skill Swap Requests

🛠️ Admin Panel for viewing/deleting users/swaps

🧾 Form-based registration and login

📂 File uploads for profile photos

🎨 Styled with clean CSS

