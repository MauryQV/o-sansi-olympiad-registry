// ModalNuevaArea.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ModalNuevaArea.css';

const ModalNuevaArea = ({ mostrar, cerrar, agregarArea, areaAEditar }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (areaAEditar) {
      setNombre(areaAEditar.nombre);
      setDescripcion(areaAEditar.descripcion);
    } else {
      setNombre('');
      setDescripcion('');
    }
  }, [areaAEditar]);

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (nombre.trim() && descripcion.trim()) {
      agregarArea({ nombre, descripcion });
      cerrar();
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h3>{areaAEditar ? 'Editar Área' : 'Registrar nueva área'}</h3>
        <p className="descripcion-modal">{areaAEditar ? 'Modifica los datos del área seleccionada.' : 'Ingrese los datos requeridos para añadir un área científica a la plataforma.'}</p>
        <form onSubmit={manejarEnvio}>
          <label>
            Nombre del Área <span className="obligatorio">*</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ejemplo: Matemática"
              required
            />
          </label>
          <label>
            Descripción <span className="obligatorio">*</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción del área científica"
              required
            ></textarea>
          </label>
          <div className="modal-botones">
            <button type="button" className="btn-cancelar" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="btn-crear">{areaAEditar ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaArea;
