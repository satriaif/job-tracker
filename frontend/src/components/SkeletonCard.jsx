export default function SkeletonCard() {
   return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
               {/* Position + status badge */}
               <div className="flex items-center gap-2">
                  <div className="h-4 bg-slate-200 rounded-full w-40"></div>
                  <div className="h-5 bg-slate-200 rounded-full w-20"></div>
               </div>
               {/* Company name */}
               <div className="h-3.5 bg-slate-200 rounded-full w-32"></div>
               {/* Meta info */}
               <div className="flex gap-3">
                  <div className="h-3 bg-slate-200 rounded-full w-20"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-16"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-24"></div>
               </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
               <div className="h-7 bg-slate-200 rounded-lg w-12"></div>
               <div className="h-7 bg-slate-200 rounded-lg w-14"></div>
            </div>
         </div>
      </div>
   );
}
