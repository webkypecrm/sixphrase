import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, staffData } = useContext(AuthContext);

  const isEmpty = Object.keys(staffData).length === 0;

  if (!isAuthenticated && isEmpty) {
    window.location.href = "/login";
    return
  }

  return children;
};

export default ProtectedRoute;
