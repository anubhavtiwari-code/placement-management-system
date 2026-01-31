import { useEffect,useState }  from "react";
import api from "../api/api";

function Students() {
    const [students,setStudents]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        api.get("/students")
        .then(res =>{
            setStudents(res.data.students);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    
    }, []);

    if (loading) return <p>Loading students ...</p>;
    return (
        <div className="p-6">
  <h2 className="text-2xl font-bold mb-4">Students</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">CGPA</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <tr key={s.id} className="text-center hover:bg-gray-50">
            <td className="border px-4 py-2">{s.id}</td>
            <td className="border px-4 py-2">{s.name}</td>
            <td className="border px-4 py-2">{s.email}</td>
            <td className="border px-4 py-2">{s.cgpa}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    );
}
export default Students;