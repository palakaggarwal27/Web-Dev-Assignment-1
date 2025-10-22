"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/component/Header/Navbar";

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null); 
  const [userData,setUserData] = useState(null)

  // Pre-fill form with fresh user data from database
  useEffect(() => {
    if (session?.user && userData) {
      setFormData({
        username: userData.username || "",
        name: userData.name || "",
        contact: userData.contact || "",
        email: userData.email || "",
        credit: userData.credit || 0,
        collegeId: userData.collegeId || false,
      });
    }
  }, [session, userData]);

    useEffect(()=>{
    if(!session?.user?.id) return
    const fetchUserData = async()=>{
      try{
        const res = await fetch("/api/user/user-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        })
        const data = await res.json()
        setUserData(data)
      }catch(err){
        console.error(err)
      }
    }
    fetchUserData()
  },[session?.user?.id])

  // ✅ Live username check
  useEffect(() => {
    if (!formData.username) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/user/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: formData.username, userId: session.user.id }),
        });
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch {
        setUsernameAvailable(null);
      }
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [formData.username, session?.user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  if (usernameAvailable === false) {
    setMessage("❌ Username already taken");
    setLoading(false);
    return;
  }

  try {
    // Update user in DB
    const res = await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, ...formData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update");

    // ✅ Fetch latest user data
    const userRes = await fetch("/api/user/user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
    });
    const updatedUser = await userRes.json();

    // Update formData with fresh user
    setFormData({
      username: updatedUser.username,
      name: updatedUser.name,
      contact: updatedUser.contact,
      email: updatedUser.email,
      credit: updatedUser.credit,
      collegeId: updatedUser.collegeId,
    });

    setMessage("✅ Profile updated successfully!");
  } catch (err) {
    setMessage("❌ " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-md mx-auto mt-6 sm:mt-10 p-4 sm:p-6 border rounded-lg shadow bg-white/80 backdrop-blur-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Profile Settings</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
              required
            />
            {usernameAvailable === false && (
              <p className="text-red-500 text-sm mt-1">Username already taken</p>
            )}
            {usernameAvailable === true && (
              <p className="text-green-500 text-sm mt-1">Username available</p>
            )}
          </div>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
            required
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
          />

          <div className="p-3 border border-gray-300 rounded-lg text-gray-600 bg-gray-50">
            <span className="font-medium">Email:</span> {formData.email}
          </div>
          <div className="p-3 border border-gray-300 rounded-lg text-gray-600 bg-gray-50">
            <span className="font-medium">College ID verified:</span> {formData.collegeId ? (
              <span className="text-green-600 font-semibold">✅ Verified</span>
            ) : (
              <span className="text-red-600">
                ❌ Not verified 
                <a href="/verify-college-id" className="text-blue-600 hover:underline ml-2">
                  Click to verify
                </a>
              </span>
            )}
          </div>
          <div className="p-3 border border-gray-300 rounded-lg text-gray-600 bg-gray-50">
            <span className="font-medium">Credit left for API calls:</span> {formData.credit ? <span className="font-semibold">{formData.credit} credits</span> : <span>❌</span>}
          </div>
         

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        {message && <p className="mt-3 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">{message}</p>}
      </div>
    </div>
  );
}

