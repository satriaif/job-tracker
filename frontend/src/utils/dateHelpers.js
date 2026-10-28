export const getCloseDateStatus = (closeDate) => {
   if (!closeDate) return null;

   const today = new Date();
   today.setHours(0, 0, 0, 0);

   // Convert to Jakarta timezone string then parse
   const jakartaDate = new Date(closeDate).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
   const [year, month, day] = jakartaDate.split("-").map(Number);
   const close = new Date(year, month - 1, day);

   const diffDays = Math.ceil((close - today) / (1000 * 60 * 60 * 24));

   if (diffDays < 0) return { type: "expired", label: "Expired", days: diffDays };
   if (diffDays <= 3) return { type: "urgent", label: `${diffDays}d left`, days: diffDays };
   return null;
};

export const exportToCsv = (applications) => {
   const headers = ["Company", "Position", "Location", "Contract Type", "Salary", "Status", "Date Applied", "Close Date", "Job Source", "Notes"];

   const rows = applications.map((app) => [
      app.company_name || "",
      app.position || "",
      app.location || "",
      app.contract_type || "",
      app.salary || "",
      app.status || "",
      app.date_applied ? new Date(app.date_applied).toLocaleDateString("en-CA") : "",
      app.close_date ? new Date(app.close_date).toLocaleDateString("en-CA") : "",
      app.job_source || "",
      (app.notes || "").replace(/,/g, ";"),
   ]);

   let csvContent = headers.join(",") + "\n";

   rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
   });

   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
   const link = document.createElement("a");
   const url = URL.createObjectURL(blob);
   link.setAttribute("href", url);
   link.setAttribute("download", `job-applications-${new Date().toISOString().split("T")[0]}.csv`);
   link.style.visibility = "hidden";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
};
