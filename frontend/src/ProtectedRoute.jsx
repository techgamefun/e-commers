import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  console.log(user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
