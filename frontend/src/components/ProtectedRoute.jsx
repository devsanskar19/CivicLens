import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("civiclens_admin_token");
  return token ? children : <Navigate to="/admin/login" replace />;
}
