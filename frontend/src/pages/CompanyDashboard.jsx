import { useEffect, useState } from "react";
import API from "../api/api";

// ── Status badge colors ──────────────────────────────────────────────────────
const STATUS_COLORS = {
  Applied:    "bg-blue-100 text-blue-800",
  Shortlisted:"bg-yellow-100 text-yellow-800",
  Interview:  "bg-purple-100 text-purple-800",
  Selected:   "bg-green-100 text-green-800",
  Rejected:   "bg-red-100 text-red-800",
};

const Badge = ({ label, colorClass }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
    {label}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
const CompanyDashboard = () => {
  // ── drives section ──
  const [drives, setDrives] = useState([]);
  const [drivesLoading, setDrivesLoading] = useState(true);

  // ── applicants section ──
  const [applicants, setApplicants] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [cgpaFilter, setCgpaFilter] = useState("");

  // ── form (create / edit) ──
  const [form, setForm] = useState({ job_title: "", min_cgpa: "", description: "", drive_date: "" });
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── active tab ──
  const [tab, setTab] = useState("drives"); // "drives" | "applicants"

  // ── load data ────────────────────────────────────────────────────────────
  const loadDrives = () => {
    setDrivesLoading(true);
    API.get("/company/job_drives")
      .then((r) => setDrives(r.data.drives || []))
      .catch(() => alert("Failed to load drives"))
      .finally(() => setDrivesLoading(false));
  };

  const loadApplicants = () => {
    setAppsLoading(true);
    API.get("/company/applicants")
      .then((r) => setApplicants(r.data.applicants || []))
      .catch(() => alert("Failed to load applicants"))
      .finally(() => setAppsLoading(false));
  };

  useEffect(() => {
    loadDrives();
    loadApplicants();
  }, []);

  // ── create / edit job ─────────────────────────────────────────────────────
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ job_title: "", min_cgpa: "", description: "", drive_date: "" });
    setFormOpen(true);
  };

  const openEditForm = (drive) => {
    setEditingId(drive.id);
    setForm({
      job_title:   drive.job_title,
      min_cgpa:    drive.min_cgpa,
      description: drive.description || "",
      drive_date:  drive.drive_date ? drive.drive_date.substring(0, 10) : "",
    });
    setFormOpen(true);
  };

  const saveJob = async () => {
    if (!form.job_title || !form.min_cgpa) {
      return alert("Job Title and Min CGPA are required.");
    }
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/company/job_drives/${editingId}`, form);
      } else {
        await API.post("/company/job_drives", form);
      }
      setFormOpen(false);
      loadDrives();
    } catch {
      alert("Failed to save job drive.");
    } finally {
      setSaving(false);
    }
  };

  // ── delete job ────────────────────────────────────────────────────────────
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job drive? All applications will also be removed.")) return;
    try {
      await API.delete(`/company/job_drives/${id}`);
      setDrives((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Failed to delete drive.");
    }
  };

  // ── toggle open / closed ──────────────────────────────────────────────────
  const toggleStatus = async (id) => {
    try {
      const res = await API.patch(`/company/job_drives/${id}/status`);
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: res.data.status } : d))
      );
    } catch {
      alert("Failed to toggle status.");
    }
  };

  // ── update applicant status ───────────────────────────────────────────────
  const updateAppStatus = async (applicationId, status) => {
    try {
      await API.patch(`/company/applications/${applicationId}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a.application_id === applicationId ? { ...a, status } : a))
      );
    } catch {
      alert("Failed to update status.");
    }
  };

  // ── filtered applicants ───────────────────────────────────────────────────
  const filteredApplicants = cgpaFilter
    ? applicants.filter((a) => parseFloat(a.student_cgpa) >= parseFloat(cgpaFilter))
    : applicants;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-5 flex items-center gap-3">
        <span className="text-2xl">🏢</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your job drives and applicants</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-6">
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {["drives", "applicants"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors ${
                tab === t
                  ? "bg-white border border-b-white border-gray-200 text-blue-600 -mb-px"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "drives" ? "📋 My Job Drives" : "👥 Applicants"}
              {t === "drives" && (
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  {drives.length}
                </span>
              )}
              {t === "applicants" && (
                <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                  {applicants.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── DRIVES TAB ──────────────────────────────────────────────────── */}
        {tab === "drives" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">All Job Drives</h2>
              <button
                onClick={openCreateForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                ＋ Create New Drive
              </button>
            </div>

            {/* Create / Edit Form */}
            {formOpen && (
              <div className="bg-white border border-blue-100 rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                  {editingId ? "✏️ Edit Job Drive" : "➕ Create Job Drive"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={form.job_title}
                      onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                      placeholder="e.g. Software Engineer"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Minimum CGPA *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={form.min_cgpa}
                      onChange={(e) => setForm({ ...form, min_cgpa: e.target.value })}
                      placeholder="e.g. 7.5"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Drive Date</label>
                    <input
                      type="date"
                      value={form.drive_date}
                      onChange={(e) => setForm({ ...form, drive_date: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Job description..."
                      rows={2}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={saveJob}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingId ? "Update Drive" : "Create Drive"}
                  </button>
                  <button
                    onClick={() => setFormOpen(false)}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Drives Table */}
            {drivesLoading ? (
              <div className="text-center py-12 text-gray-400">Loading drives...</div>
            ) : drives.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-lg mb-2">No job drives yet</p>
                <p className="text-sm">Click "Create New Drive" to post your first job.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Job Title</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Min CGPA</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Drive Date</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Applicants</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {drives.map((drive) => (
                      <tr key={drive.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-800">{drive.job_title}</td>
                        <td className="px-5 py-3 text-gray-600">{drive.min_cgpa}</td>
                        <td className="px-5 py-3 text-gray-500">
                          {drive.drive_date ? new Date(drive.drive_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            {drive.applicant_count} applied
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            label={drive.status === "open" ? "🟢 Open" : "🔴 Closed"}
                            colorClass={drive.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => toggleStatus(drive.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                drive.status === "open"
                                  ? "border-red-300 text-red-600 hover:bg-red-50"
                                  : "border-green-300 text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {drive.status === "open" ? "Close" : "Reopen"}
                            </button>
                            <button
                              onClick={() => openEditForm(drive)}
                              className="px-3 py-1 rounded-lg text-xs font-medium border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteJob(drive.id)}
                              className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-300 text-red-500 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── APPLICANTS TAB ──────────────────────────────────────────────── */}
        {tab === "applicants" && (
          <div>
            {/* Filter */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                <span className="text-gray-400 text-sm">Min CGPA ≥</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={cgpaFilter}
                  onChange={(e) => setCgpaFilter(e.target.value)}
                  placeholder="e.g. 7.5"
                  className="w-24 text-sm outline-none"
                />
                {cgpaFilter && (
                  <button
                    onClick={() => setCgpaFilter("")}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-500">
                Showing {filteredApplicants.length} of {applicants.length} applicants
              </span>
            </div>

            {appsLoading ? (
              <div className="text-center py-12 text-gray-400">Loading applicants...</div>
            ) : filteredApplicants.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-lg mb-1">No applicants found</p>
                <p className="text-sm">Try adjusting your CGPA filter.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Student</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">CGPA</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Job Drive</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Applied</th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredApplicants.map((a) => (
                      <tr key={a.application_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-800">{a.student_name}</td>
                        <td className="px-5 py-3 text-gray-500">{a.student_email}</td>
                        <td className="px-5 py-3">
                          <span className="font-semibold text-gray-700">{a.student_cgpa}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{a.job_title}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs">
                          {new Date(a.applied_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <select
                            value={a.status}
                            onChange={(e) => updateAppStatus(a.application_id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer outline-none ${
                              STATUS_COLORS[a.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {["Applied", "Shortlisted", "Interview", "Selected", "Rejected"].map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
