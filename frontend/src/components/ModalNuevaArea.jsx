// ModalNuevaArea.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ModalNuevaArea.css';

const ModalNuevaArea = ({ mostrar, cerrar, agregarArea, areaAEditar }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (areaAEditar) {
      setNombre(areaAEditar.nombre);
      setDescripcion(areaAEditar.descripcion);
    } else {
      setNombre('');
      setDescripcion('');
    }
    setErrores({});
  }, [areaAEditar]);

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del área es obligatorio.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/.test(nombre)) {
      nuevosErrores.nombre = 'Solo se permiten letras y espacios (3-50 caracteres).';
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.length < 10 || descripcion.length > 300) {
      nuevosErrores.descripcion = 'Debe tener entre 10 y 300 caracteres.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarCampos()) {
      agregarArea({ nombre: nombre.trim(), descripcion: descripcion.trim() });
      cerrar();
    }
  };

  const manejarNombreKeyPress = (e) => {
    if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ\s]/.test(e.key)) {
      e.preventDefault();
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h3>{areaAEditar ? 'Editar Área' : 'Registrar nueva área'}</h3>
        <p className="descripcion-modal">
          {areaAEditar
            ? 'Modifica los datos del área seleccionada.'
            : 'Ingrese los datos requeridos para añadir un área científica a la plataforma.'}
        </p>
        <form onSubmit={manejarEnvio} noValidate>
          <label>
            Nombre del Área <span className="obligatorio">*</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyPress={manejarNombreKeyPress}
              placeholder="Ejemplo: Matemática"
              minLength={3}
              maxLength={50}
              required
              className={errores.nombre ? 'input-error' : ''}
            />
            {errores.nombre && <span className="error-text">{errores.nombre}</span>}
          </label>
          <label>
            Descripción <span className="obligatorio">*</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción del área científica"
              minLength={10}
              maxLength={300}
              required
              className={errores.descripcion ? 'input-error' : ''}
            ></textarea>
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </label>
          <div className="modal-botones">
            <button type="button" className="btn-cancelar" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="btn-crear">
              {areaAEditar ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaArea;
