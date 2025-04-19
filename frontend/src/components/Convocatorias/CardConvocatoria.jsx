import React from 'react';
import EstadoBadge from './EstadoBadge';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import '../../styles/Convocatorias/CardConvocatoria.css';

const CardConvocatoria = ({ data }) => {
  return (
    <div className="card-convocatoria">
      <div className="card-header">
        <div className="card-title">{data.nombre}</div>
        <div className="card-icons">
          <button className="btn-icono" title="Ver">
            <Eye strokeWidth={2.5} color="#000000" />
          </button>
          <button className="btn-icono" title="Editar">
            <Pencil strokeWidth={2.5} color="#000000" />
          </button>
          <button className="btn-icono btn-delete" title="Eliminar">
            <Trash2 strokeWidth={2.5} color="red" />
          </button>
        </div>
      </div>

      <div className="card-estado">
        <EstadoBadge estado={data.estado} />
      </div>

      <p className="card-descripcion">{data.descripcion}</p>

      <div className="card-fecha">
        <span>Inscripción:</span>
        <span>{data.inscripcionInicio} - {data.inscripcionFin}</span>
      </div>

      <div className="card-fecha">
        <span>Competencia:</span>
        <span>{data.competenciaInicio} - {data.competenciaFin}</span>
      </div>

      <p className="card-areas">{data.areas} áreas seleccionadas</p>
    </div>
  );
};

export default CardConvocatoria;
