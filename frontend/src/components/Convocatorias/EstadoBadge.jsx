import React from 'react';
import '../../styles/Convocatorias/CardConvocatoria.css';

const EstadoBadge = ({ estado }) => {
  // Normalizar el estado (convertir a minúsculas y quitar espacios)
  const normalizarEstado = (estado) => {
    if (!estado) return 'sin-estado';
    
    // Convertir a minúsculas y reemplazar espacios con guiones
    return estado.toLowerCase().replace(/\s+/g, '-');
  };

  const estadoNormalizado = normalizarEstado(estado);
  
  return (
    <span className={`estado-badge ${estadoNormalizado}`}>
      {estado || "Sin estado"}
    </span>
  );
};

export default EstadoBadge;