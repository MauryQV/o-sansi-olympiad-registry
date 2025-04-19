import React, { useState, useEffect } from 'react';
import CardConvocatoria from './CardConvocatoria';
import '../../styles/Convocatorias/Convocatorias.css';

const Convocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    const datosSimulados = [
      {
        id: 1,
        nombre: "Olimpiadas Científicas Escolares 2025",
        descripcion: "Convocatoria anual para los olimpíadas para las olimpíadas científicas.",
        inscripcionInicio: "05/04/2025",
        inscripcionFin: "30/04/2025",
        competenciaInicio: "10/05/2025",
        competenciaFin: "20/05/2025",
        estado: "En inscripción",
        areas: 7
      },
      {
        id: 2,
        nombre: "Olimpiadas Científicas Escolares 2024",
        descripcion: "Convocatoria anual para los olimpíadas para las olimpíadas científicas.",
        inscripcionInicio: "10/02/2024",
        inscripcionFin: "28/02/2024",
        competenciaInicio: "15/03/2024",
        competenciaFin: "25/03/2024",
        estado: "Finalizada",
        areas: 3
      },
      {
        id: 3,
        nombre: "Olimpiadas Científicas Escolares 2023",
        descripcion: "Convocatoria anual para los olimpíadas para las olimpíadas científicas.",
        inscripcionInicio: "13/03/2023",
        inscripcionFin: "05/04/2023",
        competenciaInicio: "20/04/2023",
        competenciaFin: "30/04/2023",
        estado: "Finalizada",
        areas: 7
      }
    ];
    setConvocatorias(datosSimulados);
  }, []);

  const filtrarConvocatorias = () => {
    if (filtroEstado === 'Todos') return convocatorias;
    return convocatorias.filter(c => c.estado === filtroEstado);
  };

  return (
    <div className="convocatorias-wrapper">
      <div className="convocatorias-header">
        <h2>Gestión de Convocatorias</h2>
        <button className="btn-nueva">+ Nueva Convocatoria</button>
      </div>

      <div className="filtro-convocatorias">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="En inscripción">En inscripción</option>
          <option value="En competencia">En competencia</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>

      <div className="lista-convocatorias">
        {filtrarConvocatorias().map((convocatoria) => (
          <CardConvocatoria key={convocatoria.id} data={convocatoria} />
        ))}
      </div>
    </div>
  );
};

export default Convocatorias;
