// src/components/Registro.jsx
import React from "react";
import { useParams } from "react-router-dom";

const Registro = () => {
  const { rol } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Registro para {rol}</h2>
      <p>Formulario de registro en construcción.</p>
    </div>
  );
};

export default Registro;