import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { parse, isAfter, isBefore, isWithinInterval } from 'date-fns';
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

  const actualizarEstadosConvocatorias = (convocatorias) => {
    const hoy = new Date();
  
    return convocatorias.map((convocatoria) => {
      const inscripcionInicio = parse(convocatoria.inscripcionInicio, 'dd/MM/yyyy', new Date());
      const inscripcionFin = parse(convocatoria.inscripcionFin, 'dd/MM/yyyy', new Date());
      const competenciaInicio = parse(convocatoria.competenciaInicio, 'dd/MM/yyyy', new Date());
      const competenciaFin = parse(convocatoria.competenciaFin, 'dd/MM/yyyy', new Date());
  
      let nuevoEstado = convocatoria.estado;
  
      if (isBefore(hoy, inscripcionInicio)) {
        nuevoEstado = 'Borrador';
      } else if (isWithinInterval(hoy, { start: inscripcionInicio, end: inscripcionFin })) {
        nuevoEstado = 'En inscripción';
      } else if (isWithinInterval(hoy, { start: competenciaInicio, end: competenciaFin })) {
        nuevoEstado = 'En competencia';
      } else if (isAfter(hoy, competenciaFin)) {
        nuevoEstado = 'Finalizada';
      }
  
      return { ...convocatoria, estado: nuevoEstado };
    });
  };
  
  const filtrarConvocatorias = () => {
    const actualizadas = actualizarEstadosConvocatorias(convocatorias);
    if (filtroEstado === 'Todos') return actualizadas;
    return actualizadas.filter(c => c.estado === filtroEstado);
  };  

  const handleVer = (convocatoria) => {
    setConvocatoriaSeleccionada(convocatoria);
    setMostrarVisual(true);
  };

  const handleEditar = (convocatoria) => {
    if (convocatoria.estado === 'Finalizada') {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede editar',
        text: 'Esta convocatoria ya está finalizada y no puede ser editada.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return;
    }
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
    if (convocatoria.estado !== 'Borrador') {
      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text: 'La convocatoria no puede ser eliminada porque está en etapa de inscripción, competencia o finalizada.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return;
    }
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
        inscripcionInicio: "2025-04-05",
        inscripcionFin: "2025-04-30",
        pagoInicio: "2025-05-10",
        pagoFin: "2025-05-15",
        competenciaInicio: "2025-05-17",
        competenciaFin: "2025-05-20",
        estado: "En inscripción",
        areas: 7,
        areasSeleccionadas: ["Matemática", "Biología", "Informática","Física", "Química", "Astronomía y Astrofísica", "Robótica"]
      },
      {
        id: 2,
        nombre: "Olimpiadas Científicas Escolares 2024",
        descripcion: "Convocatoria anual para los olimpíadas para las olimpíadas científicas.",
        inscripcionInicio: "2024-10-02",
        inscripcionFin: "2024-02-28",
        pagoInicio: "2024-03-01",
        pagoFin: "2024-03-10",
        competenciaInicio: "2024-03-15",
        competenciaFin: "2024-03-25",
        estado: "Finalizada",
        areas: 3,
        areasSeleccionadas: ["Matemática", "Biología", "Informática"]
      },
      {
        id: 3,
        nombre: "Olimpiadas Científicas Escolares 2023",
        descripcion: "Convocatoria anual para los olimpíadas para las olimpíadas científicas.",
        inscripcionInicio: "2023-03-13",
        inscripcionFin: "2023-04-05",
        pagoInicio: "2023-04-10",
        pagoFin: "2023-04-15",
        competenciaInicio: "2023-04-20",
        competenciaFin: "2023-04-30",
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
          <option value="Borrador">Borrador</option>
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
