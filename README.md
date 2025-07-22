📘 Proyecta Minds – Real-Time Project Collaboration
Proyecta Minds is a MERN stack-based real-time project collaboration platform designed for college students and developers. It allows users to create, manage, and contribute to coding projects in real time. The platform includes a Docker-powered code editor, chat collaboration, merge approval system, and more.

🎯 Objective
To simplify remote project collaboration by combining real-time communication, role-based project management, and secure code execution in one unified platform.

🔥 Core Features
🔐 User Authentication (Login & Register)

👥 Role-based Access

Project Leader

Collaborators

Admin

🧠 Real-time Collaborative Code Editor

Powered by Docker

Multi-user editing & execution

📂 Project Management System

Project creation

Collaboration requests

Approval workflows

💬 Real-time Chat System

Project-level conversations

🔄 Merge Approval Flow

Project Leader reviews and approves code changes before they’re committed

🛠 Admin Dashboard

View projects in real-time without refreshing

🧾 Docker Integration

Secure backend code execution environment

🧱 Tech Stack
Layer	Technology
Frontend	React.js, TailwindCSS
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Realtime	Socket.IO
Code Exec	Docker (with backend APIs)
Auth	JWT, bcrypt
Dev Tools	Git, Postman, VSCode
Deployment	Railway (Backend), Vercel/Render (Frontend)

🧪 How to Run Locally
1️⃣ Clone the Repository
bash
Copy
Edit
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
4️⃣ Setup Docker
Ensure Docker Desktop is installed and running. Docker will be used to safely execute code from the code editor in a containerized environment.

🔐 Environment Variables (Backend)
Create a .env file inside the backend folder:

env
Copy
Edit
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000
🚀 Planned Enhancements
✅ GitHub Integration for version control

✅ Real-time Video Call Support (via WebRTC)

✅ AI-based Code Suggestions (via LLM API like OpenAI/Gemini)

✅ WhatsApp Bot for Project Notifications (via Gemini API)

👥 Contributors
Aryan Gidde

Chaitanya Teke

Uday Saptale

Aarya Khedekar

Mohan Chhapari
