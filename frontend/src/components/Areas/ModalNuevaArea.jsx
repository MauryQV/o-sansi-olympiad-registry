import React, { useState } from 'react';
import '../../styles/ModalNuevaArea.css';
import { useAreaForm } from '../../hooks/useAreaForm';
//no tocar
import { crearArea, actualizarArea } from '../../services/areaService'; 

const ModalNuevaArea = ({ mostrar, cerrar, onCreacionExitosa, areaAEditar }) => {
  const {
    nombre, descripcion, costo,
    errores, validar, getData,
    onNombre, onDescripcion, onCosto,
    soloLetras, bloquearTexto
  } = useAreaForm(mostrar, areaAEditar);

  const [cargando, setCargando] = useState(false);

  if (!mostrar) return null;

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validar()) return;
  
    try {
      setCargando(true);
      const nuevaArea = getData();
  
      let respuesta;
      if (areaAEditar) {
        // Actualizar área existente
        respuesta = await actualizarArea(areaAEditar.id, nuevaArea);
      } else {
        // Crear nueva área
        respuesta = await crearArea(nuevaArea);
      }
  
      if (onCreacionExitosa) onCreacionExitosa(respuesta);
      cerrar();
    } catch (error) {
      console.error('Error guardando el área:', error);
      alert('Error al guardar el área. Verifica los datos o intenta más tarde.');
    } finally {
      setCargando(false);
    }
  };
  

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
              onChange={onNombre}
              onKeyPress={soloLetras}
              placeholder="Ejemplo: matematica"
              minLength={3}
              maxLength={50}
              required
              className={errores.nombre ? 'input-error' : ''}
              disabled={cargando}
            />
            {errores.nombre && <span className="error-text">{errores.nombre}</span>}
          </label>

          <label>
            Descripción <span className="obligatorio">*</span>
            <textarea
              value={descripcion}
              onChange={onDescripcion}
              placeholder="Breve descripción del área científica"
              minLength={10}
              maxLength={100}
              required
              className={errores.descripcion ? 'input-error' : ''}
              disabled={cargando}
            ></textarea>
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </label>

          <label>
            Costo (Bs) <span className="obligatorio">*</span>
            <input
              type="text"
              value={costo}
              onChange={onCosto}
              onKeyPress={bloquearTexto}
              placeholder="Ejemplo: 25"
              required
              className={errores.costo ? 'input-error' : ''}
              disabled={cargando}
            />
            {errores.costo && <span className="error-text">{errores.costo}</span>}
          </label>

          <div className="modal-botones">
            <button type="button" className="btn-cancelar" onClick={cerrar} disabled={cargando}>Cancelar</button>
            <button type="submit" className="btn-crear" disabled={cargando}>
              {cargando ? 'Guardando...' : areaAEditar ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaArea;
