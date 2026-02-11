import { useEffect, useState } from "react";
import API from "../api/api";

const CompanyDashboard = () => {
  const [applicants, setApplicants] = useState([]);

const [form, setForm] = useState({
  job_title: "",
  min_cgpa: "",
  description: "",
});
const createJob = async () => {
  await API.post("/company/job-drive", form)
;
alert("Job created successfully");
};




  useEffect(() => {
    API.get("/company/applicants")
      .then((res) => setApplicants(res.data.applicants))
      .catch(() => alert("Failed to load applicants"));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏢 Company Dashboard</h1>

      <h1 className="text-2xl font-bold mb-4">Applicants</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Job</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {applicants.map((a, i) => (
            <tr key={i}>
              <td className="border p-2">{a.student_name}</td>
              <td className="border p-2">{a.student_email}</td>
              <td className="border p-2">{a.job_title}</td>
              <td className="border p-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

//     <div className="bg-white p-6 rounded mb-6">
//   <h2 className="text-xl font-semibold mb-4">Create Job Drive</h2>

//   <input
//     type="text"
//     placeholder="Job Title"
//     className="border p-2 mb-2 w-full"
//     onChange={(e) => setForm({...form, job_title: e.target.value})}
//   />

//   <input
//     type="number"
//     placeholder="Minimum CGPA"
//     className="border p-2 mb-2 w-full"
//     onChange={(e) => setForm({...form, min_cgpa: e.target.value})}
//   />

//   <textarea
//     placeholder="Job Description"
//     className="border p-2 mb-2 w-full"
//     onChange={(e) => setForm({...form, description: e.target.value})}
//   />

//   <button
//     onClick={createJob}
//     className="bg-blue-600 text-white px-4 py-2 rounded"
//   >
//     Create Job
//   </button>
// </div>

  );
};

export default CompanyDashboard;
