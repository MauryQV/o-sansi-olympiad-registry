// src/routes/RutaProtegida.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RutaProtegida = ({ children, rolRequerido }) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default RutaProtegida;
