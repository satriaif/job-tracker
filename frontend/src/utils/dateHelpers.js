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
