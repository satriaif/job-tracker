import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfileApi, changePasswordApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
   const navigate = useNavigate();
   const { user, logout, updateUser } = useAuth();

   const [name, setName] = useState(user?.name || "");
   const [nameMsg, setNameMsg] = useState("");
   const [nameLoading, setNameLoading] = useState(false);

   const [passwords, setPasswords] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
   });
   const [passwordMsg, setPasswordMsg] = useState("");
   const [passwordError, setPasswordError] = useState("");
   const [passwordLoading, setPasswordLoading] = useState(false);

   const handleNameSubmit = async (e) => {
      e.preventDefault();
      setNameMsg("");
      setNameLoading(true);

      try {
         const data = await updateProfileApi({ name });
         updateUser(data.user);
         setNameMsg("Name updated successfully");
      } catch (err) {
         setNameMsg(err.response?.data?.message || "Something went wrong");
      } finally {
         setNameLoading(false);
      }
   };

   const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      setPasswordError("");
      setPasswordMsg("");

      if (passwords.newPassword !== passwords.confirmPassword) {
         setPasswordError("New passwords do not match");
         return;
      }

      if (passwords.newPassword.length < 6) {
         setPasswordError("New password must be at least 6 characters");
         return;
      }

      setPasswordLoading(true);

      try {
         const data = await changePasswordApi({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
         });
         setPasswordMsg(data.message);
         setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (err) {
         setPasswordError(err.response?.data?.message || "Something went wrong");
      } finally {
         setPasswordLoading(false);
      }
   };

   const handleLogout = () => {
      logout();
      navigate("/login");
   };

   return (
      <div className="min-h-screen bg-slate-50">
         <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
               <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 text-sm">
                  ← Dashboard
               </Link>
               <h1 className="font-bold text-slate-800">Profile</h1>
            </div>
         </header>

         <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            {/* Update name */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
               <h2 className="font-semibold text-slate-700 mb-4">Account Info</h2>

               <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                  <input
                     type="email"
                     value={user?.email || ""}
                     disabled
                     className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-400"
                  />
               </div>

               <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {nameMsg && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">{nameMsg}</p>}

                  <button
                     type="submit"
                     disabled={nameLoading}
                     className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                     {nameLoading ? "Saving..." : "Save Name"}
                  </button>
               </form>
            </div>

            {/* Change password */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
               <h2 className="font-semibold text-slate-700 mb-4">Change Password</h2>

               {passwordError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{passwordError}</div>}

               {passwordMsg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl">{passwordMsg}</div>}

               <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-600 mb-1.5">Current Password</label>
                     <input
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-600 mb-1.5">New Password</label>
                     <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-600 mb-1.5">Confirm New Password</label>
                     <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={passwordLoading}
                     className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                     {passwordLoading ? "Saving..." : "Change Password"}
                  </button>
               </form>
            </div>
         </main>
      </div>
   );
}
