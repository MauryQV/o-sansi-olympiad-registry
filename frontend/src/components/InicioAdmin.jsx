import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 
import '../styles/InicioAdmin.css';
import { getAreas } from '../services/areaService'
import { obtenerConvocatorias } from '../services/convocatoriaService';

const InicioAdmin = () => {
  const [estadisticas, setEstadisticas] = useState({
    areas: 0,
    convocatorias: 0,
    competidores: 0,
    inscripciones: 0,
  });
  const [convocatoriasRecientes, setConvocatoriasRecientes] = useState([]);
  const [areas, setAreas] = useState([]);

  const cargarAreas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
      setEstadisticas(prevEstadisticas => ({
        ...prevEstadisticas,
        areas: data.length,
      }));
    } catch (error) {
      console.error('Error cargando áreas:', error);
      Swal.fire('Error', 'No se pudieron cargar las áreas', 'error');
    }
  };
  const cargarConvocatorias = async () => {
    try {
      const data = await obtenerConvocatorias();
      setConvocatoriasRecientes(data);
    } catch (error) {
      console.error('Error cargando convocatorias:', error);
      Swal.fire('Error', 'No se pudieron cargar las convocatorias', 'error');
    }
  };
  

  useEffect(() => {
    cargarAreas();
    cargarConvocatorias();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>
      <div className="admin-resumen">
        <div className="admin-box">Áreas Científicas:<br/><span>{estadisticas.areas}</span></div>
        <div className="admin-box">Convocatorias Activas:<br/><span>{estadisticas.convocatorias}</span></div>
        <div className="admin-box">Total Competidores:<br/><span>{estadisticas.competidores}</span></div>
        <div className="admin-box">Inscripciones:<br/><span>{estadisticas.inscripciones}</span></div>
      </div>

      <div className="admin-contenido">
        <div className="admin-card">
          <h3>Convocatorias Recientes</h3>
          <div className="admin-lista">
            {convocatoriasRecientes.map((c, i) => (
              <div key={i} className="convocatoria-item">
                <strong>{c.nombre_convocatoria}</strong>
                <p>{c.descripcion_convocatoria}</p>
                <p>Inscripción: {c.fecha_inicio.split('T')[0]} - {c.fecha_fin.split('T')[0]}</p>
                <div className="convocatoria-reciente-estado">
                    <span className={`estado-tag ${c.estado.replace(/\s+/g, '-')}`}> {c.estado}</span>
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
                <strong>{a.nombre_area}</strong>
                <p>{a.descripcion_area.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioAdmin;