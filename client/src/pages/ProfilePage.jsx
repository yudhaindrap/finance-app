import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { ArrowLeft, LogOut } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/auth/profile", {
        name: user.name,
        email: user.email,
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await API.put("/auth/change-password", passwords);
      toast.success("Password updated!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/");
  };

  const renderInitialAvatar = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white border rounded shadow p-8">
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <div className="space-x-2 flex">
            <button
              onClick={goToDashboard}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              title="Back to Dashboard"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Avatar dengan Initial */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full bg-pink-500 text-white flex items-center justify-center text-4xl font-bold shadow">
            {renderInitialAvatar(user.name)}
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Old Password</label>
          <input
            type="password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
