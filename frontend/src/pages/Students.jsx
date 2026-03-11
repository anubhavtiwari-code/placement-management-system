import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/students")
      .then(res => {
        setStudents(res.data.students || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load students directory.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">
      <div className="glass-panel p-6 sm:p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">🎓 Students Directory</h1>
          <p className="text-slate-400">View and manage all registered student profiles.</p>
        </div>
        <div className="bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1.5 rounded-lg text-sm font-medium">
          {students.length} Total
        </div>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <span className="text-slate-400 animate-pulse">Syncing directory...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
             <p className="text-4xl mb-3">📭</p>
             <p className="text-lg font-medium text-slate-200 mb-1">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">CGPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 bg-slate-900/30">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono">#{s.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{s.name}</td>
                    <td className="px-6 py-4 text-slate-400">{s.email}</td>
                    <td className="px-6 py-4 font-bold text-brand-400">{Number(s.cgpa).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;