import React, { useState, useEffect } from 'react';
import CardConvocatoria from './CardConvocatoria';
import ModalNuevaConvocatoria from './ModalNuevaConvocatoria';
import ModalVisualizarConvocatoria from './ModalVisualizarConvocatoria';
import '../../styles/Convocatorias/Convocatorias.css';

const Convocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarVisual, setMostrarVisual] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);

  const agregarConvocatoria = (nueva) => {
    const conAreas = {
      ...nueva,
      id: convocatorias.length + 1,
      areas: nueva.areasSeleccionadas.length
    };
    setConvocatorias(prev => [...prev, conAreas]);
    setMostrarModal(false);
  };
  

  const filtrarConvocatorias = () => {
    if (filtroEstado === 'Todos') return convocatorias;
    return convocatorias.filter(c => c.estado === filtroEstado);
  };

  const handleVer = (convocatoria) => {
    setConvocatoriaSeleccionada(convocatoria);
    setMostrarVisual(true);
  };

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
        areas: 7,
        areasSeleccionadas: ["Matemática", "Biología", "Informática","Fisica", "Quimica", "Astronomia", "Robotica"]
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
        areas: 3,
        areasSeleccionadas: ["Matemática", "Biología", "Informática"]
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
        areas: 5,
        areasSeleccionadas: ["Matemática", "Fisica", "Quimica", "Astronomia", "Robotica"]
      }
    ];
    setConvocatorias(datosSimulados);
  }, []);

  return (
    <div className="convocatorias-wrapper">
      <div className="convocatorias-header">
        <h2>Gestión de Convocatorias</h2>
        <button className="btn-nueva" onClick={() => setMostrarModal(true)}>
          + Nueva Convocatoria
        </button>
      </div>

      <div className="filtro-convocatorias">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos los estados</option>
          <option value="En inscripción">En inscripción</option>
          <option value="En competencia">En competencia</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>

      <div className="lista-convocatorias">
        {filtrarConvocatorias().map((convocatoria) => (
          <CardConvocatoria
            key={convocatoria.id}
            data={convocatoria}
            onVer={handleVer}
          />
        ))}
      </div>

      {mostrarModal && (
        <ModalNuevaConvocatoria
          visible={mostrarModal}
          cerrar={() => setMostrarModal(false)}
          agregar={agregarConvocatoria}
        />
      )}

      {mostrarVisual && (
        <ModalVisualizarConvocatoria
          visible={mostrarVisual}
          convocatoria={convocatoriaSeleccionada}
          cerrar={() => setMostrarVisual(false)}
        />
      )}
    </div>
  );
};

export default Convocatorias;
