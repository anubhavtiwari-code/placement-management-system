<div align="center">
  <h1>🚀 NexusPlace | Advanced Placement Management System</h1>
  <p>A full-stack, enterprise-grade placement portal built with <b>React, Node.js, Express, MySQL, and JWT Authentication.</b> Featuring a stunning modern <b>Space-Dark Glassmorphic UI</b> and robust role-based access control.</p>
</div>

<br />

## ✨ About The Project

NexusPlace is a completely modernized Placement Management System designed to bridge the gap between Students, Companies, and University Administrators. It moves beyond standard CRUD applications by implementing a highly secure, scalable relational database backed by connection pooling and a globally handled Express API. 

The frontend experience is entirely bespoke, utilizing `framer-motion` and custom CSS for a premium, interactive, and responsive glassmorphic aesthetic.

---

## 📈 Development Activity

| Log Date | Update Detail | Scope | Status |
| :--- | :--- | :--- | :--- |
| **Mar 14, 2026** | **Admin Experience & Reliability**: Optimized controller documentation with JSDoc, improved global error handling strings, and enhanced Admin Dashboard with "Live Sync" and segmented navigation. | Backend / UI | ✅ Complete |
| **Mar 12, 2026** | **Bug Resolution**: Fixed SQL syntax issues in stats query and resolved port conflicts. | Infrastructure | ✅ Complete |
| **Mar 11, 2026** | **Deployment**: Configured Vercel/Cloud-ready environment variables and SSL handling. | DevOps | ✅ Complete |

---

## 🌟 Core Features

### 🔐 Security & Architecture
- **JWT-Based Authentication**: Secure login system with `bcrypt` password hashing.
- **Role-Based Access Control (RBAC)**: Distinct protected routing and API gateways for **Student**, **Company**, and **Admin** roles.
- **Global Error Handling**: Express middleware protecting the server from runtime crashes and formatting clean JSON error responses.
- **MySQL Connection Pooling**: Optimized concurrent database operations.

### 🎓 Student Portal
- Immerse in a dynamic dashboard to view available job drives.
- One-click application process for open job roles.
- Dedicated "Application Tracker" to monitor real-time company responses (Applied, Shortlisted, Interview, Selected, Rejected).
- Profile management tracking active academic records (CGPA).

### 🏢 Company Console
- **Drive Manager**: Create, deploy, edit, and suspend recruitment drives.
- **Applicant Sandbox**: Review applicants exclusively for your deployed drives (ownership strictly enforced at the backend level).
- **Intelligent Filtering**: Instantly filter applicant pools by minimum CGPA requirements.
- **Status Updates**: seamlessly update applicant tracking statuses directly modifying the student's portal view.

### 🛠️ Admin Central
- Real-time aggregated statistics across the entire ecosystem.
- `Recharts` integrated animated spark-line charts for metrics.
- Global tracking of Students, Companies, Job Drives, and active Applications.

---

## 🧑‍💻 Tech Stack

### Frontend Architecture
- **Framework**: React.js
- **Styling**: Tailwind CSS + Custom CSS Variables (Dark Glassmorphism)
- **Routing**: React Router DOM (v6)
- **Animations & Feedback**: Framer Motion, React-Hot-Toast
- **Data Fetching**: Axios

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (relational modeling, foreign-key constraints)
- **Security**: JSON Web Tokens (JWT), Bcrypt.js, CORS

---

## 🗄️ Database Design

The relational logic is strictly governed by MySQL Foreign Keys ensuring absolute data integrity:
- `users`: Core authentication table formatting the RBAC tree.
- `students`: Linked metadata (Name, Email, CGPA).
- `companies`: Linked metadata (Company Name).
- `job_drives`: Linked via `company_id`.
- `applications`: Junction mapping linking `student_id` to `job_drive_id` with a volatile `status` column.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MySQL Server

### 1. Database Configuration
1. Create a MySQL database (e.g., `placement_management`).
2. Run your SQL schema to generate the required tables.

### 2. Backend Initialization
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=placement_management
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```
Start the server:
```bash
npm run dev
# Server will mount on http://localhost:5000
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
```
Start the React App:
```bash
npm start
# App will launch on http://localhost:3000
```

---

## 🎨 Design Philosophy
The entire application UI avoids generic component libraries. It is constructed from the ground up using a tokenized dark theme utilizing the `Inter` and `Outfit` font families. Interactive elements feature translucent glass panels, floating hover states, and neon glow effects.

> Built for modern academic and corporate ecosystems.
