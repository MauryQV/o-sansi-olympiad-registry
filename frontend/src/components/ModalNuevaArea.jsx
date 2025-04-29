// ModalNuevaArea.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ModalNuevaArea.css';

const ModalNuevaArea = ({ mostrar, cerrar, agregarArea, areaAEditar }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costo, setCosto] = useState('');
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (!mostrar) return;

    if (areaAEditar) {
      setNombre(areaAEditar.nombre || '');
      setDescripcion(areaAEditar.descripcion || '');
      setCosto(areaAEditar.costo !== undefined ? areaAEditar.costo.toString() : '');
    } else {
      setNombre('');
      setDescripcion('');
      setCosto('');
    }
    setErrores({});
  }, [areaAEditar, mostrar]);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del área es obligatorio.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/.test(nombre)) {
      nuevosErrores.nombre = 'Solo se permiten letras y espacios (3-50 caracteres).';
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.length < 10 || descripcion.length > 100) {
      nuevosErrores.descripcion = 'Debe tener entre 10 y 100 caracteres.';
    }

    if (!costo.trim()) {
      nuevosErrores.costo = 'El costo es obligatorio.';
    } else if (!/^\d+$/.test(costo)) {
      nuevosErrores.costo = 'Solo se permiten números.';
    } else if (parseInt(costo) < 10 || parseInt(costo) > 30) {
      nuevosErrores.costo = 'El costo debe estar entre 10 y 30 Bs.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarCampos()) {
      agregarArea({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        costo: parseInt(costo)
      });
      cerrar();
    }
  };

  const manejarNombreKeyPress = (e) => {
    if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ\s]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const manejarCostoKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
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
              maxLength={100}
              required
              className={errores.descripcion ? 'input-error' : ''}
            ></textarea>
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </label>

          <label>
            Costo (Bs) <span className="obligatorio">*</span>
            <input
              type="text"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              onKeyPress={manejarCostoKeyPress}
              placeholder="Ejemplo: 25"
              required
              className={errores.costo ? 'input-error' : ''}
            />
            {errores.costo && <span className="error-text">{errores.costo}</span>}
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
