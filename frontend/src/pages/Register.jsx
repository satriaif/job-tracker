import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
   const navigate = useNavigate();
   const { login } = useAuth();

   const [form, setForm] = useState({ name: "", email: "", password: "" });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         await registerApi(form);
         const { loginApi } = await import("../api/auth");
         const data = await loginApi({
            email: form.email,
            password: form.password,
         });
         login(data.user, data.token);
         navigate("/dashboard");
      } catch (err) {
         setError(err.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-md p-8">
            <div className="mb-8">
               <h1 className="text-2xl font-bold text-slate-800">Create account</h1>
               <p className="text-slate-400 mt-1">Start tracking your applications</p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                  <input
                     type="text"
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Your full name"
                     required
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                  <input
                     type="email"
                     name="email"
                     value={form.email}
                     onChange={handleChange}
                     className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="you@example.com"
                     required
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
                  <input
                     type="password"
                     name="password"
                     value={form.password}
                     onChange={handleChange}
                     className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="••••••••"
                     required
                  />
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors"
               >
                  {loading ? "Creating account..." : "Create Account"}
               </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
               Already have an account?{" "}
               <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
               </Link>
            </p>
         </div>
      </div>
   );
}
