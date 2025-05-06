import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus } from 'lucide-react';
import CardConvocatoria from './CardConvocatoria';
import ModalNuevaConvocatoria from './ModalNuevaConvocatoria';
import ModalVisualizarConvocatoria from './ModalVisualizarConvocatoria';
import ModalEditarConvocatoria from './ModalEditarConvocatoria';
import ModalEliminarConvocatoria from './ModalEliminarConvocatoria';
import { obtenerConvocatorias } from '../../services/convocatoriaService';
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

  const cargarConvocatorias = async () => {
    try {
      const data = await obtenerConvocatorias();
      setConvocatorias(data);
    } catch (error) {
      console.error('Error cargando convocatorias:', error);
      Swal.fire('Error', 'No se pudieron cargar las convocatorias', 'error');
    }
  };

  const handleVer = (convocatoria) => {
    setConvocatoriaSeleccionada(convocatoria);
    setMostrarVisual(true);
  };

  const handleEditar = (convocatoria) => {
    if (convocatoria.estado === 'FINALIZADA') {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede editar',
        text: 'Esta convocatoria ya está finalizada y no puede ser editada.',
      });
      return;
    }
    setConvocatoriaEditando(convocatoria);
    setMostrarEditar(true);
  };

  const handleEliminar = (convocatoria) => {
    if (convocatoria.estado !== 'BORRADOR') {
      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text: 'La convocatoria no puede ser eliminada porque no está en estado de borrador.',
      });
      return;
    }
    setConvocatoriaAEliminar(convocatoria);
    setMostrarEliminar(true);
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  return (
    <div className="convocatorias-wrapper">
      <div className="convocatorias-header">
        <h2>Gestión de Convocatorias</h2>
        <button className="btn-nueva" onClick={() => setMostrarModal(true)}>
          <span className="icono-circular">
            <Plus size={16} strokeWidth={2.5} />
          </span>
          Nueva Convocatoria
        </button>
      </div>

      <div className="filtro-convocatorias">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos los estados</option>
          <option value="BORRADOR">Borrador</option>
          <option value="EN INSCRIPCION">En inscripción</option>
          <option value="EN COMPETENCIA">En competencia</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
      </div>

      <div className="lista-convocatorias">
        {convocatorias
          .filter(c => filtroEstado === 'Todos' || c.estado.nombre === filtroEstado)
          .map(convocatoria => (
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
          recargarConvocatorias={cargarConvocatorias}
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
          recargarConvocatorias={cargarConvocatorias}
        />
      )}

      {mostrarEliminar && (
        <ModalEliminarConvocatoria
          visible={mostrarEliminar}
          convocatoria={convocatoriaAEliminar}
          cerrar={() => setMostrarEliminar(false)}
          recargarConvocatorias={cargarConvocatorias}
        />
      )}
    </div>
  );
};

export default Convocatorias;
