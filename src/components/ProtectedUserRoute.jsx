import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import userApiClient from "../services/userApiClient";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedUserRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    userApiClient.get("/users/me")
      .then(() => setStatus("ok"))
      .catch(() => setStatus("redirect"));
  }, []);

  if (status === "loading") return <LoadingSpinner fullPage />;
  if (status === "redirect") return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedUserRoute;