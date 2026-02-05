import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
                Placement management system
            </h1>

            <p className="text-gray-600 text-center max-w-xl mb-8">
                A role based platform for students, companies, and admins to manage
        campus placements efficiently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <RoleCard title="Student" desc="Apply to jobs & track status" />
        <RoleCard title="Company" desc="Create drives & shortlist students" />
        <RoleCard title="Admin" desc="Manage users & monitor system" /> 
            </div>
            <div className="flex gap-4">
                <Link to ="/login" className="btn-primary">Login</Link>
                <Link to ="/register" className="btn-outline">Register</Link>
            </div>
        </div>
    );
}
function RoleCard({ title, desc }) {
    return (
        <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-500">{desc}</p>
        </div>
    );
}