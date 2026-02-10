

// require("dotenv").config();
// //require("dotenv").config();
// const express = require('express');
// const cors =require("cors");
// const app= express();
// const db = require("./config/db");
// const authRoutes = require("./routes/auth.route");
// const auth = require("./middleware/auth.middleware");
// app.use(cors());
// app.use(express.json());
// app.use('/api/auth' , authRoutes);
// app.use("/api/company", require("./routes/company.route"));

// app.get('/',(req , res)=> {
//     res.send("placement backend is running")
// });
// app.get("/api/protected", auth(["student"]), (req, res) => {
//   res.json({
//     message: "Protected route accessed",
//     user: req.user,
//   });
// });
// app.get('/api/test' , (req , res)=>{
//     res.json({
//         message: 'api is working fine',
//         status: 'success'
//     });
// });

// app.post('/api/students' , (req, res)=>{
//     const { name , email , cgpa} = req.body;

//     if (!name || !email || !cgpa) {
//         return res.status(400).json({ 
//             message: 'All fields are required',
//         });
// }
// const query = "INSERT INTO students(name, email, cgpa) VALUES (?, ?, ?)";
// db.query(query, [name, email, cgpa], (err, result) => {
//     if (err) {
        
//         return res.status(500).json({
//              message: 'Database error',
//              error: err,
//             });
//     }
  
 
//     res.status(201).json({
//         message: 'Student added successfully',
//         studentId: result.insertId,
//     });
// });
// });

// app.post ('/api/companies' , (req , res) => {
//     const {name, email , password } = req.body;
//     if (!name || !email || !password ) {
//         return res.status(400).json({
//             message: 'All fields are required',
//         });
    
        
//     }
//     const query = "INSERT INTO companies(name, email, password) VALUES (?, ?, ?)";
//     db.query(query, [name, email, password], (err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'database error',
//                 error: err,
//             });
//         }
//         res.status(201).json({
//             message: 'Company added successfully',
//             companyId: result.insertId, 
//         });
//             });
// });

//  app.post('/api/job_drives' , (req,res) =>{
//     const { company_id, job_title, description, min_cgpa, drive_date } = req.body;

//     if (!company_id || !job_title  || !min_cgpa || !drive_date) {
//         return res.status(400).json({
//             message: 'required fields are missing',

//         });
//     }
//     const query = 'INSERT INTO job_drives(company_id, job_title, description, min_cgpa, drive_date) VALUES (?, ?, ?, ?, ?)';
//     db.query(query, [company_id, job_title, description, min_cgpa, drive_date], (err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Database error',
//                 error: err,
//             });
//         }
//         res.status(201).json({
//             message: 'Job drive created successfully',
//             jobDriveId: result.insertId,
//         });
//     });
//  });

// app.post('/api/applications' , (req, res) =>{
//     const {student_id , job_drive_id} = req.body ;

//     if(!student_id || !job_drive_id){
//         return res.status(400).json({
//             message : 'required fields are missing',
//         });

//     }
//     const query = `
//     INSERT INTO applications (student_id, job_drive_id)
//     VALUES (?, ?)
//   `;
//  db.query(query, [student_id, job_drive_id], (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Database error",
//         error: err,
//       });
//     }

//     res.status(201).json({
//       message: "Applied to job drive successfully",
//       applicationId: result.insertId,
//     });
//   });
// });


// app.put("/api/applications/:id/status", (req, res) => {
//   const applicationId = req.params.id;
//   let { status } = req.body;

//   const allowedStatus = [
//     "Applied",
//     "Shortlisted",
//     "Interview",
//     "Selected",
//     "Rejected",
//   ];

//   if (!allowedStatus.includes(status)) {
//     return res.status(400).json({
//       message: "Invalid status value",
//     });
//   }

//   const query = `
//     UPDATE applications 
//     SET status = ? 
//     WHERE id = ?
//   `;

//   db.query(query, [status, applicationId], (err, result) => {
//     if (err) {
//       console.error("Status update error:", err);
//       return res.status(500).json({
//         message: "Database error",
//       });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         message: "Application not found",
//       });
//     }

//     res.json({
//       message: "Application status updated successfully",
//       status,
//     });
//   });
// });




// app.get('/api/students' , (req , res)=>{
//     const query = "SELECT * FROM students";
//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Database error',
//                 error: err,
//             });
//         }
//         res.json({
//             count: results.length,
//             students: results,
//         });
//     });
// });


// app.get('/api/companies' , (req , res)=>{
//     const query = "SELECT * FROM companies";
//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Database error',
//                 error: err,
//             });
//         }
//         res.json({
//             count: results.length,
//             companies: results,
//         });
//     });
// });

// app.get('/api/job_drives' , (req , res) =>{
//     const query = `
//     SELECT 
//       job_drives.id,
//       job_drives.job_title,
//       job_drives.min_cgpa,
//       job_drives.drive_date,
//       companies.name AS company_name
//     FROM job_drives
//     JOIN companies ON job_drives.company_id = companies.id
//   `;
//     db.query(query , (err,results) =>{
//         if(err) {
//             return res.status(500).json({
//                 message: 'database error',
//                 error : err,
//             });
//         }
//         res.json({
//             count : results.length,
//             job_drives : results,
//         });
//     });
// });



// app.get("/api/applications", (req, res) => {
//   const query = `
//     SELECT
//       applications.id,
//       students.name AS student_name,
//       companies.name AS company_name,
//       job_drives.job_title,
//       applications.status,
//       applications.applied_at
//     FROM applications
//     JOIN students ON applications.student_id = students.id
//     JOIN job_drives ON applications.job_drive_id = job_drives.id
//     JOIN companies ON job_drives.company_id = companies.id
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Database error",
//         error: err,
//       });
//     }

//     res.json({
//       count: results.length,
//       applications: results,
//     });
//   });
// });
//  app.get('/api/dashboard/stats' , (req ,res)=>{
//     const query = `
//     SELECT
//     (select count(*) from students) as total_students,
//     (select count(*) from companies) as total_companies,
//     (select count(*) from job_drives) as total_job_drives,
//     (select count(*) from applications) as total_applications,
//     (select count(*) from applications where status = "selected") as total_selected_students
//     `;

//     db.query (query , (err, results) => {
//         if(err){
//             return res.status(500).json({
//                 message: "Database error",
//                 error: err,
//             });
//         }
//         res.json({
//             stats: results[0],
//         });
//     });
//     });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./config/db");
const auth = require("./middleware/auth.middleware");

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROUTES (JWT SYSTEM)
// =======================

// AUTH ROUTES
app.use("/api/auth", require("./routes/auth.route"));

// COMPANY ROUTES (JWT BASED)
app.use("/api/company", require("./routes/company.route"));
//app.use("/api/student", require("./routes/student.route"));
app.use("/api", require("./routes/applicationRoutes"));
app.use("/api/student", require("./routes/student.route"));



// =======================
// BASIC TEST ROUTES
// =======================
app.get("/", (req, res) => {
  res.send("Placement backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working fine",
    status: "success",
  });
});

// PROTECTED TEST ROUTE
app.get("/api/protected", auth(["student", "company", "admin"]), (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// =======================
// READ-ONLY ROUTES (SAFE)
// =======================

// GET JOB DRIVES (students/admin)
app.get("/api/job_drives", (req, res) => {
  const query = `
    SELECT 
      job_drives.id,
      job_drives.job_title,
      job_drives.min_cgpa,
      job_drives.drive_date,
      companies.name AS company_name
    FROM job_drives
    JOIN companies ON job_drives.company_id = companies.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({
      count: results.length,
      job_drives: results,
    });
  });
});

// GET APPLICATIONS (admin view)
app.get("/api/applications", (req, res) => {
  const query = `
    SELECT
      applications.id,
      students.name AS student_name,
      companies.name AS company_name,
      job_drives.job_title,
      applications.status,
      applications.applied_at
    FROM applications
    JOIN students ON applications.student_id = students.id
    JOIN job_drives ON applications.job_drive_id = job_drives.id
    JOIN companies ON job_drives.company_id = companies.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({
      count: results.length,
      applications: results,
    });
  });
});

// ADMIN DASHBOARD STATS
app.get("/api/dashboard/stats", (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM students) AS total_students,
      (SELECT COUNT(*) FROM companies) AS total_companies,
      (SELECT COUNT(*) FROM job_drives) AS total_job_drives,
      (SELECT COUNT(*) FROM applications) AS total_applications,
      (SELECT COUNT(*) FROM applications WHERE status = "Selected") AS total_selected_students
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ stats: results[0] });
  });
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
