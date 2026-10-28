import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddApplication from "./pages/AddApplication";
import EditApplication from "./pages/EditApplication";

export default function App() {
   return (
      <Routes>
         <Route path="/" element={<Navigate to="/dashboard" replace />} />

         <Route
            path="/login"
            element={
               <GuestRoute>
                  <Login />
               </GuestRoute>
            }
         />

         <Route
            path="/register"
            element={
               <GuestRoute>
                  <Register />
               </GuestRoute>
            }
         />

         <Route
            path="/dashboard"
            element={
               <ProtectedRoute>
                  <Dashboard />
               </ProtectedRoute>
            }
         />

         <Route
            path="/add"
            element={
               <ProtectedRoute>
                  <AddApplication />
               </ProtectedRoute>
            }
         />

         <Route
            path="/edit/:id"
            element={
               <ProtectedRoute>
                  <EditApplication />
               </ProtectedRoute>
            }
         />
      </Routes>
   );
}
