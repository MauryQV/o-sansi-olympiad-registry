// ModalConfirmacionEliminarCategoria.jsx
import React from 'react';
import '../../styles/Areas/ModalConfirmacionEliminarCategoria.css';

const ModalConfirmacionEliminarCategoria = ({ mostrar, cerrar, confirmar, nombreCategoria }) => {
  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h3>¿Eliminar Categoría?</h3>
        <p>¿Estás seguro que deseas eliminar la categoría <strong>{nombreCategoria}</strong>? Esta acción no se puede deshacer.</p>
        <div className="modal-botones">
          <button className="btn-cancelar" onClick={cerrar}>Cancelar</button>
          <button className="btn-crear" onClick={confirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionEliminarCategoria;
//alv