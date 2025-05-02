import React from 'react';
import '../../styles/Areas/ModalConfirmacionEliminar.css';


const ModalConfirmacionEliminar = ({ mostrar, cerrar, confirmar, nombreArea}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido eliminar">
        <h3>¿Eliminar área?</h3>
        <p>
          Esta acción no se puede deshacer. Eliminará permanentemente el área
          <strong> "{nombreArea}" </strong> y todas sus categorías asociadas.
        </p>
        <div className="modal-botones">
          <button className="btn-cancelar" onClick={cerrar}>Cancelar</button>
          <button className="btn-eliminar" onClick={confirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionEliminar;