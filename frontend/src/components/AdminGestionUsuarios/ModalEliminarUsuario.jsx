
import React from 'react';
import '../../styles/AdminGestionUsuarios/ModalEliminarUsuario.css'; // creamos este CSS también
import { X } from 'lucide-react'; // para el botón cerrar

const ModalEliminarUsuario = ({ usuario, onClose, onConfirmarEliminar }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-contenido-eliminar">
        <div className="modal-header">
          <h2>¿Eliminar usuario?</h2>
          <button className="cerrar-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="modal-subtitulo">
          Esta acción no se puede deshacer. Eliminará permanentemente al usuario <strong>"{usuario.nombre}"</strong>.
        </p>

        <div className="modales-botones">
          <button className="boton-cancelar" onClick={onClose}><b>Cancelar</b></button>
          <button className="boton-eliminar" onClick={onConfirmarEliminar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarUsuario;
