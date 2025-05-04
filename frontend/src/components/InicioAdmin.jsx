import React from "react";
import { useParams } from "react-router-dom";

const Registro = () => {
  const { rol } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Inicio AMINISTRADOR{rol}</h2>
      <p>aqui inicias.</p>
    </div>
  );
};

export default Registro;