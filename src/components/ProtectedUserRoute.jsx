import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import userApiClient from "../services/userApiClient";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedUserRoute({ children }) {
  const [status, setStatus] = useState("loading");
  const location = useLocation();

  useEffect(() => {
    userApiClient.get("/users/me")
      .then(() => setStatus("ok"))
      .catch(() => setStatus("redirect"));
  }, []);

  if (status === "loading") return <LoadingSpinner fullPage />;
  if (status === "redirect") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default ProtectedUserRoute;