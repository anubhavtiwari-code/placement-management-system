import { useEffect, useState } from "react";
import API from "../api/api";

const CompanyDashboard = () => {
  const [applicants, setApplicants] = useState([]);

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
  );
};

export default CompanyDashboard;
