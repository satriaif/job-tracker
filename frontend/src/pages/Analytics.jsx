import { useState, useEffect } from "react";
import { getApplicationsApi } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Link, useNavigate } from "react-router-dom";

export default function Analytics() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const [applications, setApplications] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const load = async () => {
         try {
            const data = await getApplicationsApi();
            setApplications(data);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      load();
   }, []);

   // Group applications by week for bar chart
   const weeklyData = (() => {
      const weeks = {};

      applications.forEach((app) => {
         if (!app.date_applied) return;

         const date = new Date(app.date_applied);
         // Get the Monday of that week
         const day = date.getDay();
         const diff = date.getDate() - day + (day === 0 ? -6 : 1);
         const monday = new Date(date.setDate(diff));
         const weekKey = monday.toLocaleDateString("en-CA");

         if (!weeks[weekKey]) {
            weeks[weekKey] = { week: weekKey, count: 0 };
         }
         weeks[weekKey].count++;
      });

      // Sort by week and format the label
      return Object.values(weeks)
         .sort((a, b) => new Date(a.week) - new Date(b.week))
         .map((item) => ({
            ...item,
            label: new Date(item.week).toLocaleDateString("en-CA"),
         }));
   })();

   // Count applications by status for donut chart
   const statusData = (() => {
      const counts = {};
      applications.forEach((app) => {
         counts[app.status] = (counts[app.status] || 0) + 1;
      });
      return Object.entries(counts).map(([status, count]) => ({
         name: status,
         value: count,
      }));
   })();

   const STATUS_COLORS = {
      Wishlist: "#94a3b8",
      Applied: "#3b82f6",
      "HR Review": "#eab308",
      Interview: "#a855f7",
      Offer: "#22c55e",
      Accepted: "#10b981",
      Rejected: "#ef4444",
      Withdrawn: "#f97316",
   };

   const handleLogout = () => {
      logout();
      navigate("/login");
   };

   return (
      <div className="min-h-screen bg-slate-50">
         {/* Navbar */}
         <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
               <div>
                  <h1 className="font-bold text-slate-800 text-lg">Job Tracker</h1>
                  <p className="text-xs text-slate-400">Welcome, {user?.name}</p>
               </div>
               <div className="flex items-center gap-3">
                  <Link
                     to="/dashboard"
                     className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors"
                  >
                     ← Dashboard
                  </Link>
                  <button
                     onClick={handleLogout}
                     className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors"
                  >
                     Logout
                  </button>
               </div>
            </div>
         </header>

         <main className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="font-bold text-slate-700 text-xl mb-6">Analytics</h2>

            {loading ? (
               <p className="text-center text-slate-400 py-20">Loading...</p>
            ) : applications.length === 0 ? (
               <div className="text-center py-20">
                  <p className="text-slate-400 text-lg">No data to show</p>
                  <p className="text-slate-400 text-sm">Add some applications to see analytics</p>
               </div>
            ) : (
               <div className="space-y-8">
                  {/* Bar chart - applications per week */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                     <h3 className="font-semibold text-slate-700 mb-4">Applications per Week</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                           <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                           <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                           <Tooltip
                              contentStyle={{
                                 borderRadius: "12px",
                                 border: "1px solid #e2e8f0",
                                 fontSize: "13px",
                              }}
                           />
                           <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Applications" />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>

                  {/* Donut chart - status breakdown */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                     <h3 className="font-semibold text-slate-700 mb-4">Status Breakdown</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                           <Pie
                              data={statusData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                           >
                              {statusData.map((entry) => (
                                 <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#cbd5e1"} />
                              ))}
                           </Pie>
                           <Tooltip
                              contentStyle={{
                                 borderRadius: "12px",
                                 border: "1px solid #e2e8f0",
                                 fontSize: "13px",
                              }}
                           />
                           <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}
