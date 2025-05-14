import React from 'react';
import '../../styles/Convocatorias/ModalEliminarConvocatoria.css';

const ModalEliminarConvocatoria = ({ visible, cerrar, confirmar, convocatoria }) => {
  if (!visible || !convocatoria) return null;

  return (
    <div className="modal-eliminar-overlay">
      <div className="modal-eliminar">
        <h3 className="modal-eliminar-titulo">¿Eliminar convocatoria?</h3>
        <p className="modal-eliminar-texto">
          Esta acción no se puede deshacer. Eliminará permanentemente la convocatoria
          <strong> "{convocatoria.nombre_convocatoria}"</strong>.
        </p>

        <div className="modal-eliminar-botones">
          <button className="btn-cancelar" onClick={cerrar}>Cancelar</button>
          <button className="btn-eliminar" onClick={confirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarConvocatoria;
