import React, { useState, useEffect } from 'react';
import CardConvocatoria from './CardConvocatoria';
import ModalNuevaConvocatoria from './ModalNuevaConvocatoria';
import ModalVisualizarConvocatoria from './ModalVisualizarConvocatoria';
import ModalEditarConvocatoria from './ModalEditarConvocatoria';
import ModalEliminarConvocatoria from './ModalEliminarConvocatoria';
import '../../styles/Convocatorias/Convocatorias.css';

const Convocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarVisual, setMostrarVisual] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [convocatoriaEditando, setConvocatoriaEditando] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [convocatoriaAEliminar, setConvocatoriaAEliminar] = useState(null);

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

  const handleEditar = (convocatoria) => {
    setConvocatoriaEditando(convocatoria);
    setMostrarEditar(true);
  };
  
  const actualizarConvocatoria = (actualizada) => {
    setConvocatorias(prev =>
      prev.map(c => c.id === actualizada.id ? actualizada : c)
    );
    setMostrarEditar(false);
  };  

  const handleEliminar = (convocatoria) => {
    setConvocatoriaAEliminar(convocatoria);
    setMostrarEliminar(true);
  };

  const confirmarEliminacion = () => {
    setConvocatorias(prev => prev.filter(c => c.id !== convocatoriaAEliminar.id));
    setMostrarEliminar(false);
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
        areasSeleccionadas: ["Matemática", "Biología", "Informática","Física", "Química", "Astronomía y Astrofísica", "Robótica"]
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
        areasSeleccionadas: ["Matemática", "Física", "Química", "Astronomía y Astrofísica", "Robótica"]
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
            onEditar={handleEditar}
            onEliminar={handleEliminar}
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

      {mostrarEditar && (
        <ModalEditarConvocatoria
          visible={mostrarEditar}
          convocatoria={convocatoriaEditando}
          cerrar={() => setMostrarEditar(false)}
          guardar={actualizarConvocatoria}
        />
      )}

      {mostrarEliminar && (
        <ModalEliminarConvocatoria
          visible={mostrarEliminar}
          cerrar={() => setMostrarEliminar(false)}
          confirmar={confirmarEliminacion}
          convocatoria={convocatoriaAEliminar}
        />
      )}
    </div>
  );
};

export default Convocatorias;
