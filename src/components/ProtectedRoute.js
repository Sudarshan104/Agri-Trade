import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/Auth";

export default function ProtectedRoute({ role, children }) {
  const user = getUser();

  // 1️⃣ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Support nested routes
  return children ? children : <Outlet />;
}
