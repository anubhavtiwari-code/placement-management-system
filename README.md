# Placement Management System

A full-stack Placement Management System built with **React, Node.js, Express, MySQL, and JWT authentication**.  
The system supports **role-based access** for Students, Companies, and Admins.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based login system
- Role-based access control (Student / Company / Admin)
- Secure password hashing using bcrypt

### 🎓 Student
- View available job drives
- Apply to job drives
- Access controlled using JWT

### 🏢 Company
- Create job drives
- View applicants for their own job drives only
- Ownership enforced at backend level

### 🛠️ Admin
- View system statistics:
  - Total students
  - Total companies
  - Total job drives
  - Total applications
- Admin users are system-controlled (not public registration)

---

## 🧑‍💻 Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MySQL
- JWT (Authentication)
- bcrypt (Password hashing)

---

## 🗄️ Database Design
- Users table for authentication
- Separate tables for students, companies, job drives, and applications
- Foreign key constraints to ensure data integrity

---


---

## 🏁 Conclusion
This project demonstrates real-world backend concepts like authentication, authorization, relational databases, and role-based systems, integrated with a modern React frontend.

