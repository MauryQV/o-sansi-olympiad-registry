
import React, { useEffect, useState } from 'react';
import '../styles/InicioAdmin.css';

const InicioAdmin = () => {
  const [estadisticas, setEstadisticas] = useState({
    areas: 0,
    convocatorias: 0,
    competidores: 0,
    inscripciones: 0,
  });
  const [convocatoriasRecientes, setConvocatoriasRecientes] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    // simu
    setTimeout(() => {
      setEstadisticas({
        areas: 7,
        convocatorias: 1,
        competidores: 5,
        inscripciones: 5,
      });

      setConvocatoriasRecientes([
        {
          nombre: 'Olimpiada Científica Estudiantil 2025',
          descripcion: 'Convocatoria anual para las olimpiadas científicas a nivel departamental.',
          fecha_inicio: '2025-03-01',
          fecha_fin: '2025-05-31',
          estado: 'En inscripción'
        },
        {
          nombre: 'Olimpiada Científica Estudiantil 2024',
          descripcion: 'Convocatoria anual para las olimpiadas científicas a nivel departamental.',
          fecha_inicio: '2024-03-01',
          fecha_fin: '2024-05-31',
          estado: 'Finalizado'
        }
      ]);

      setAreas([
        { nombre: 'Matemática', descripcion: 'Olimpiada de Matemática con énfasis en el razonamiento lógico y numérico.' },
        { nombre: 'Robótica', descripcion: 'Competencia de diseño, construcción y programación de robots.' },
        { nombre: 'Astronomía y Astrofísica', descripcion: 'Estudio de cuerpos celestes y fenómenos del universo observable.' },
        { nombre: 'Biología', descripcion: 'Competencia sobre los principios fundamentales de la biología celular y molecular.' },
        { nombre: 'Química', descripcion: 'Olimpiada centrada en principios químicos y solución de problemas experimentales.' },
        { nombre: 'Física', descripcion: 'Competencia sobre los principios físicos, leyes del movimiento y termodinámica.' },
        { nombre: 'Informática', descripcion: 'Desafíos de programación, algoritmos y estructuras de datos.' }
      ]);
    }, 500);
  }, []);

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>
      <div className="admin-resumen">
        <div className="admin-box">Áreas Científicas<br/><span>{estadisticas.areas}</span></div>
        <div className="admin-box">Convocatorias Activas<br/><span>{estadisticas.convocatorias}</span></div>
        <div className="admin-box">Total Competidores<br/><span>{estadisticas.competidores}</span></div>
        <div className="admin-box">Inscripciones<br/><span>{estadisticas.inscripciones}</span></div>
      </div>

      <div className="admin-contenido">
        <div className="admin-card">
          <h3>Convocatorias Recientes</h3>
          <div className="admin-lista">
            {convocatoriasRecientes.map((c, i) => (
              <div key={i} className="convocatoria-item">
                <strong>{c.nombre}</strong>
                <p>{c.descripcion}</p>
                <p>Inscripción: {c.fecha_inicio} - {c.fecha_fin}</p>
                <div className="convocatoria-reciente-estado"> 
                  <span className={`estado-tag ${c.estado.toLowerCase().replace(/\s+/g, '-')}`}>{c.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>Áreas de Competencia</h3>
          <div className="admin-lista-scroll">
            {areas.map((a, i) => (
              <div key={i} className="area-item">
                <strong>{a.nombre}</strong>
                <p>{a.descripcion.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioAdmin;

