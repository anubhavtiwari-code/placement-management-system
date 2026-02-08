import { useEffect, useState } from "react";
import api from "../api/api";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/student/profile");
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-gray-500">Loading profile...</p>;
  if (!profile) return null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">👤 My Profile</h2>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <p><span className="font-medium">Name:</span> {profile.name}</p>
        <p><span className="font-medium">Email:</span> {profile.email}</p>
        <p><span className="font-medium">Branch:</span> {profile.branch}</p>
        <p><span className="font-medium">CGPA:</span> {profile.cgpa}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
