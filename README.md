# 📘 Proyecta Minds – Real-Time Project Collaboration

**Proyecta Minds** is a **MERN stack**-based real-time project collaboration platform designed for **college students and developers**. It allows users to **create, manage, and contribute to coding projects** seamlessly in a team environment. Key features include a **real-time code editor** (powered by Docker), **chat-based collaboration**, **permission-based code merging**, and a **project approval workflow**.

---

## 🎯 Objective

To simplify remote project collaboration by combining **real-time communication**, **role-based project management**, and **secure code execution** in one unified platform.

---

## 🔥 Core Features

- 🔐 **User Authentication**
- 👥 **Role-based Access**: Project Leader, Collaborators, Admin
- 🧠 **Real-time Collaborative Code Editor** (Docker-based execution)
- 📂 **Project Creation**, Collaboration Requests, Approval Flow
- 💬 **Chat System** for Project Members
- 🔄 **Merge Approval System** for Proposed Code Changes
- 🛠 **Admin Dashboard** with Real-Time Updates on Projects
- 🧾 **Docker Integration** for Secure Backend Code Execution

---

## 🧱 Tech Stack

| Layer       | Technology                         |
|------------|-------------------------------------|
| Frontend    | React.js             |
| Backend     | Node.js, Express.js                |
| Database    | MongoDB, Mongoose                  |
| Realtime    | Socket.IO                          |
| Code Exec   | Docker (via backend APIs)          |
| Auth        | JWT, bcrypt                        |
| Dev Tools   | Git, Postman, VSCode               |


---

## 🧪 How to Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/giddearyan12/proyecta-minds.git
2️⃣ Install Backend
bash
Copy
Edit
cd backend
npm install
node serve.js
3️⃣ Install Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
4️⃣ Setup Docker Execution
Make sure Docker Desktop is installed and running. Docker is used to run code in isolated containers securely.

🔐 Environment Variables
Create a .env file in your backend directory and add the following:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
🚀 Planned Enhancements
✅ GitHub Integration for Version Control

✅ Real-Time Video Call Support via WebRTC

✅ AI-Powered Code Suggestions via LLM API

✅ WhatsApp Bot for Project Updates (via Gemini API)

👥 Contributors
Aryan Gidde

Chaitanya Teke

Uday Saptale

Aarya Khedekar

Mohan Chhapari

