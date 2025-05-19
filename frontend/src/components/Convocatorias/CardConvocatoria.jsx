import React from 'react';
import EstadoBadge from './EstadoBadge';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import '../../styles/Convocatorias/CardConvocatoria.css';

const CardConvocatoria = ({ data, onVer, onEditar, onEliminar }) => {
  // Obtener el estado de la convocatoria
  const getEstado = () => {
    if (!data.estado) return 'SIN ESTADO';
    return typeof data.estado === 'object' ? data.estado.nombre : data.estado;
  };

  // Obtener el texto de áreas seleccionadas basado en numero_areas
  const getAreasText = () => {
    const numAreas = data.numero_areas || 0;
    return `${numAreas} áreas seleccionadas`;
  };

  // Función para formatear fechas de manera segura
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return dateStr.split('T')[0].split('-').reverse().join('/');
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };

  return (
    <div className="card-convocatoria">
      <div className="card-header">
        <div className="card-title">{data.nombre_convocatoria}</div>
        <div className="card-icons">
          <button title="Ver" onClick={() => onVer(data)}>
            <Eye size={18} />
          </button>
          <button title="Editar" onClick={() => onEditar(data)}>
            <Pencil size={18} />
          </button>
          <button title="Eliminar" className="btn-delete" onClick={() => onEliminar(data)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <EstadoBadge estado={getEstado()} />
      
      <p className="card-descripcion">{data.descripcion_convocatoria}</p>
      
      <div className="card-fecha">
        <span>Inscripción:</span>
        <span>
          {data.fecha_inicio ? formatDate(data.fecha_inicio) : 'N/A'} - 
          {data.fecha_fin ? formatDate(data.fecha_fin) : 'N/A'}
        </span>
      </div>
      
      <div className="card-fecha">
        <span>Pago:</span>
        <span>
          {data.pago_inicio ? formatDate(data.pago_inicio) : 'N/A'} - 
          {data.pago_fin ? formatDate(data.pago_fin) : 'N/A'}
        </span>
      </div>
      
      <div className="card-fecha">
        <span>Competencia:</span>
        <span>
          {data.competicion_inicio ? formatDate(data.competicion_inicio) : 'N/A'} - 
          {data.competicion_fin ? formatDate(data.competicion_fin) : 'N/A'}
        </span>
      </div>
      
      <p className="card-areas">{getAreasText()}</p>
    </div>
  );
};

export default CardConvocatoria;