import React from 'react';
import '../../styles/Convocatorias/EstadoBadge.css';

const EstadoBadge = ({ estado }) => {
  const clase = estado.toLowerCase().replace(/\s/g, '-');
  return <span className={`estado-badge ${clase}`}>{estado}</span>;
};

export default EstadoBadge;
