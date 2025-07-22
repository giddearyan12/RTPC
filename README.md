📘 Proyecta Minds – Real-Time Project Collaboration


Proyecta Minds is a MERN stack-based real-time project collaboration platform designed for college students and developers. It allows users to create, manage, and contribute to coding projects seamlessly in a team environment. Key features include a real-time code editor (powered by Docker), chat-based collaboration, permission-based code merging, and a project approval workflow.

🎯 Objective
To simplify remote project collaboration by combining real-time communication, role-based project management, and secure code execution in one unified platform.


🔥 Core Features

🔐 User authentication

👥 Role-based access: Project Leader, Collaborators, Admin

🧠 Real-time collaborative code editor (Docker-based execution)

📂 Project creation, collaboration requests, approval flow

💬 Chat system for project members

🔄 Merge approval system for proposed code changes

🛠 Admin dashboard with real-time updates on project creation

🧾 Docker integration for secure backend code execution


🧱 Tech Stack
Layer	Technology
Frontend	React.js, TailwindCSS
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Realtime	Socket.IO
Code Exec	Docker (with backend APIs)
Auth	JWT + bcrypt
Dev Tools	Git, Postman, VSCode
Deployment	Railway (backend), Render / Vercel (frontend)

🧪 How to Run Locally
Clone Repo

git clone https://github.com/giddearyan12/proyecta-minds.git


Install Backend

cd backend

npm install

node serve.js



Install Frontend

cd ../frontend

npm install

npm run dev


Setup Docker Execution
Make sure Docker Desktop is installed and running. The Docker container runs isolated code execution.


🔐 Environment Variables

MONGO_URI=your_mongodb_url

JWT_SECRET=your_secret_key

PORT=5000


🧠 Planned Enhancements

✅ GitHub integration for version control

✅ Real-time video call support via WebRTC

✅ AI-powered code suggestions (via LLM API)

✅ WhatsApp bot for project updates (via Gemini API)


👥 Contributors

Aryan Gidde 

Chaitanya Teke

Uday Saptale

Aarya Khedekar

Mohan Chhapari
