import { Component } from "react";

export default class ErrorBoundary extends Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
   }

   render() {
      if (this.state.hasError) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
               <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center">
                  <div className="text-4xl mb-4">😵</div>
                  <h1 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h1>
                  <p className="text-slate-400 text-sm mb-6">An unexpected error occurred. Please try refreshing the page.</p>
                  <button
                     onClick={() => window.location.reload()}
                     className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                     Refresh Page
                  </button>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}
