import React from 'react';
import EstadoBadge from './EstadoBadge';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import '../../styles/Convocatorias/CardConvocatoria.css';

const CardConvocatoria = ({ data, onVer, onEditar, onEliminar}) => {
  return (
    <div className="card-convocatoria">
      <div className="card-header">
        <div className="card-title">{data.nombre}</div>
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
      <EstadoBadge estado={data.estado} />
      <p className="card-descripcion">{data.descripcion}</p>
      <div className="card-fecha">
        <span>Inscripción:</span>
        <span>{data.inscripcionInicio} - {data.inscripcionFin}</span>
      </div>
      <div className="card-fecha">
        <span>Pago:</span>
        <span>{data.pagoInicio} - {data.pagoFin}</span>
      </div>
      <div className="card-fecha">
        <span>Competencia:</span>
        <span>{data.competenciaInicio} - {data.competenciaFin}</span>
      </div>
      <p className="card-areas">{data.areasSeleccionadas?.length || data.areas} áreas seleccionadas</p>
    </div>
  );
};

export default CardConvocatoria;
