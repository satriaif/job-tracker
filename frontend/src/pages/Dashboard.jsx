import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApplicationsApi, deleteApplicationApi } from "../api/applications";
import { useAuth } from "../context/AuthContext";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonSummary from "../components/SkeletonSummary";
import { getCloseDateStatus } from "../utils/dateHelpers";

const STATUS_COLORS = {
   Wishlist: "bg-slate-100 text-slate-600",
   Applied: "bg-blue-100 text-blue-600",
   "HR Review": "bg-yellow-100 text-yellow-600",
   Interview: "bg-purple-100 text-purple-600",
   Offer: "bg-green-100 text-green-600",
   Accepted: "bg-emerald-100 text-emerald-700",
   Rejected: "bg-red-100 text-red-600",
   Withdrawn: "bg-orange-100 text-orange-600",
};

export default function Dashboard() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const [applications, setApplications] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState("All");

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

   useEffect(() => {
      load();
   }, []);

   const handleDelete = async (id) => {
      if (!window.confirm("Delete this application?")) return;
      await deleteApplicationApi(id);
      load();
   };

   const handleLogout = () => {
      logout();
      navigate("/login");
   };

   const statuses = ["All", "Wishlist", "Applied", "HR Review", "Interview", "Offer", "Accepted", "Rejected", "Withdrawn"];

   const filtered = filter === "All" ? applications : applications.filter((a) => a.status === filter);

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
                  <Link to="/add" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                     + Add Application
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
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
               {loading
                  ? [...Array(4)].map((_, i) => <SkeletonSummary key={i} />)
                  : [
                       { label: "Total", value: applications.length, color: "text-slate-700" },
                       { label: "Applied", value: applications.filter((a) => a.status === "Applied").length, color: "text-blue-600" },
                       { label: "Interview", value: applications.filter((a) => a.status === "Interview").length, color: "text-purple-600" },
                       { label: "Offer", value: applications.filter((a) => a.status === "Offer").length, color: "text-green-600" },
                    ].map((s) => (
                       <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4">
                          <p className="text-xs text-slate-400">{s.label}</p>
                          <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                       </div>
                    ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
               {statuses.map((s) => (
                  <button
                     key={s}
                     onClick={() => setFilter(s)}
                     className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${
                                   filter === s ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                  >
                     {s}
                  </button>
               ))}
            </div>

            {/* Applications list */}
            {loading ? (
               <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                     <SkeletonCard key={i} />
                  ))}
               </div>
            ) : filtered.length === 0 ? (
               <div className="text-center py-20">
                  <p className="text-slate-400 text-lg">No applications yet</p>
                  <p className="text-slate-400 text-sm mb-6">Start tracking your job applications</p>
                  <Link to="/add" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                     + Add Application
                  </Link>
               </div>
            ) : (
               <div className="space-y-3">
                  {filtered.map((app) => {
                     const closeDateStatus = getCloseDateStatus(app.close_date);

                     return (
                        <div
                           key={app.id}
                           className={`bg-white border rounded-2xl p-5 hover:border-slate-300 transition-colors
                ${
                   closeDateStatus?.type === "expired"
                      ? "border-red-300 bg-red-50"
                      : closeDateStatus?.type === "urgent"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200"
                }`}
                        >
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="font-semibold text-slate-800">{app.position}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                                    {closeDateStatus && (
                                       <span
                                          className={`text-xs px-2 py-0.5 rounded-full font-medium
                                ${closeDateStatus.type === "expired" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}
                                       >
                                          {closeDateStatus.type === "expired" ? "🚨" : "⚠️"} {closeDateStatus.label}
                                       </span>
                                    )}
                                 </div>
                                 <p className="text-slate-500 text-sm">{app.company_name}</p>
                                 <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                                    {app.location && <span>📍 {app.location}</span>}
                                    {app.contract_type && <span>💼 {app.contract_type}</span>}
                                    {app.salary && <span>💰 {app.salary}</span>}
                                    {app.date_applied && (
                                       <span>📅 {new Date(app.date_applied).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}</span>
                                    )}

                                    {app.close_date && (
                                       <span
                                          className={
                                             closeDateStatus?.type === "expired"
                                                ? "text-red-500 font-medium"
                                                : closeDateStatus?.type === "urgent"
                                                  ? "text-orange-500 font-medium"
                                                  : ""
                                          }
                                       >
                                          ⏰ Closes: {new Date(app.close_date).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}
                                       </span>
                                    )}
                                    {app.job_source && <span>🔗 {app.job_source}</span>}
                                 </div>
                                 {app.notes && <p className="text-xs text-slate-400 mt-2 italic">{app.notes}</p>}
                              </div>
                              <div className="flex gap-2 shrink-0">
                                 <button
                                    onClick={() => navigate(`/edit/${app.id}`)}
                                    className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                 >
                                    Edit
                                 </button>
                                 <button
                                    onClick={() => handleDelete(app.id)}
                                    className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                                 >
                                    Delete
                                 </button>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </main>
      </div>
   );
}
