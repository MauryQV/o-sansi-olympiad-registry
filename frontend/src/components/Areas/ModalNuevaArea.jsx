import React, { useState, useEffect } from 'react';
import '../../styles/Areas/ModalNuevaArea.css';
import { useAreaForm } from '../../hooks/useAreaForm';
//no tocar
import { crearArea, actualizarArea, getAreas } from '../../services/areaService'; 

const ModalNuevaArea = ({ mostrar, cerrar, onCreacionExitosa, areaAEditar }) => {
  const [areasExistentes, setAreasExistentes] = useState([]);
  const {
    nombre, descripcion, costo,
    errores, validar, getData,
    onNombre, onDescripcion, onCosto,
    soloLetras, bloquearTexto
  } = useAreaForm(mostrar, areaAEditar, areasExistentes);

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarAreas = async () => {
      if (mostrar) {
        try {
          const data = await getAreas();
          setAreasExistentes(data || []);
        } catch (error) {
          console.error("Error al cargar áreas existentes:", error);
          setAreasExistentes([]);
        }
      }
    };
    cargarAreas();
  }, [mostrar]);

  if (!mostrar) return null;

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validar()) return;
  
    try {
      setCargando(true);
      const datosArea = getData();
  
      let respuesta;
      if (areaAEditar) {
        // Actualizar área existente
        respuesta = await actualizarArea(areaAEditar.id, datosArea);
      } else {
        // Crear nueva área
        respuesta = await crearArea(datosArea);
      }
  
      if (onCreacionExitosa) onCreacionExitosa(respuesta);
      cerrar();
      window.location.reload(); 
    } catch (error) {
      console.error('Error guardando el área:', error);
      alert(error.message || 'Error al guardar el área. Verifica los datos o intenta más tarde.');
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
