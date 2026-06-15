import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { obterSessao } from "../services/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const sessao = obterSessao();

  if (!sessao?.success) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
