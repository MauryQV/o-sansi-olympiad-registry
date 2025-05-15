import React from 'react';
import '../../styles/Convocatorias/CardConvocatoria.css';
import '../../styles/Convocatorias/EstadoBadge.css'; // Asegúrate de que la ruta sea correcta

const EstadoBadge = ({ estado }) => {
  // Normaliza el nombre del estado para que coincida con la clase CSS
  const normalizarEstado = (estado) => {
    if (!estado) return 'sin-estado';

    return estado
      .normalize('NFD') // elimina acentos
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
  };

  const estadoNormalizado = normalizarEstado(estado);

  return (
    <span className={`estado-badge ${estadoNormalizado}`}>
      {estado || 'Sin estado'}
    </span>
  );
};

export default EstadoBadge;
