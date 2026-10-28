import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getApplicationApi, updateApplicationApi } from "../api/applications";

const STATUSES = ["Wishlist", "Applied", "HR Review", "Interview", "Offer", "Accepted", "Rejected", "Withdrawn"];
const CONTRACT_TYPES = ["Full Time", "Part Time", "Internship", "Freelance"];
const JOB_SOURCES = ["LinkedIn", "Jobstreet", "Glints", "Kalibrr", "Referral", "Other"];

export default function EditApplication() {
   const { id } = useParams();
   const navigate = useNavigate();

   const [loading, setLoading] = useState(false);
   const [fetching, setFetching] = useState(true);
   const [error, setError] = useState("");

   const [form, setForm] = useState({
      company_name: "",
      position: "",
      location: "",
      contract_type: "",
      salary: "",
      status: "Wishlist",
      date_applied: "",
      close_date: "",
      job_source: "",
      notes: "",
   });

   useEffect(() => {
      const fetch = async () => {
         try {
            const data = await getApplicationApi(id);
            setForm({
               company_name: data.company_name || "",
               position: data.position || "",
               location: data.location || "",
               contract_type: data.contract_type || "",
               salary: data.salary || "",
               status: data.status || "Wishlist",
               date_applied: data.date_applied ? new Date(data.date_applied).toISOString().split("T")[0] : "",
               close_date: data.close_date ? new Date(data.close_date).toISOString().split("T")[0] : "",
               job_source: data.job_source || "",
               notes: data.notes || "",
            });
         } catch (err) {
            setError("Application not found");
         } finally {
            setFetching(false);
         }
      };
      fetch();
   }, [id]);

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         await updateApplicationApi(id, form);
         navigate("/dashboard");
      } catch (err) {
         setError(err.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   if (fetching) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-400">Loading...</p>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-slate-50">
         <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
               <Link to="/dashboard" className="text-slate-400 hover:text-slate-600 text-sm">
                  ← Back
               </Link>
               <h1 className="font-bold text-slate-800">Edit Application</h1>
            </div>
         </header>

         <main className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
               {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Company Name *</label>
                        <input
                           type="text"
                           name="company_name"
                           value={form.company_name}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Position *</label>
                        <input
                           type="text"
                           name="position"
                           value={form.position}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                           required
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Location</label>
                        <input
                           type="text"
                           name="location"
                           value={form.location}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Salary</label>
                        <input
                           type="text"
                           name="salary"
                           value={form.salary}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Contract Type</label>
                        <select
                           name="contract_type"
                           value={form.contract_type}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="">— Select —</option>
                           {CONTRACT_TYPES.map((c) => (
                              <option key={c} value={c}>
                                 {c}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Status</label>
                        <select
                           name="status"
                           value={form.status}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                 {s}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Date Applied</label>
                        <input
                           type="date"
                           name="date_applied"
                           value={form.date_applied}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Close Date</label>
                        <input
                           type="date"
                           name="close_date"
                           value={form.close_date}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>

                     <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Job Source</label>
                        <select
                           name="job_source"
                           value={form.job_source}
                           onChange={handleChange}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="">— Select —</option>
                           {JOB_SOURCES.map((s) => (
                              <option key={s} value={s}>
                                 {s}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Notes</label>
                        <textarea
                           name="notes"
                           value={form.notes}
                           onChange={handleChange}
                           rows={3}
                           className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                     </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                     <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors"
                     >
                        {loading ? "Saving..." : "Save Changes"}
                     </button>
                     <Link
                        to="/dashboard"
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors text-center"
                     >
                        Cancel
                     </Link>
                  </div>
               </form>
            </div>
         </main>
      </div>
   );
}
