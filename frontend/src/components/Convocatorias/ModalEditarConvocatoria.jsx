import React, { useState, useEffect } from 'react';
import '../../styles/Convocatorias/ModalNuevaConvocatoria.css';
import { obtenerConvocatoriaPorId } from '../../services/convocatoriaService';
import { getAreas } from '../../services/areaService';

const ModalEditarConvocatoria = ({ visible, cerrar, convocatoria, guardar }) => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    estado: 'Borrador',
    descripcion: '',
    inscripcionInicio: '',
    inscripcionFin: '',
    pagoInicio: '',
    pagoFin: '',
    competenciaInicio: '',
    competenciaFin: '',
    areas: [],
  });

  const [errores, setErrores] = useState({});
  const [areasDisponibles, setAreasDisponibles] = useState([]);

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const areas = await getAreas(); 
        setAreasDisponibles(areas.map(area => area.nombre_area)); 
      } catch (error) {
        console.error('Error al cargar las áreas:', error);
      }
    };

    cargarAreas();
  }, []); 

  useEffect(() => {
    const cargarConvocatoria = async () => {
      if (convocatoria?.id) {
        try {
          const datos = await obtenerConvocatoriaPorId(convocatoria.id);
          
          // Extract area names instead of IDs to match with areasDisponibles
          const areasNombres = datos.Area_convocatoria?.map(area => area.nombre_area) || [];
          
          setFormulario({
            nombre: datos.nombre_convocatoria || '',
            estado: datos.id_estado_convocatoria || 'Borrador',
            descripcion: datos.descripcion_convocatoria || '',
            inscripcionInicio: datos.fecha_inicio?.split('T')[0] || '',
            inscripcionFin: datos.fecha_fin?.split('T')[0] || '',
            pagoInicio: datos.pago_inicio?.split('T')[0] || '',
            pagoFin: datos.pago_fin?.split('T')[0] || '',
            competenciaInicio: datos.competicion_inicio?.split('T')[0] || '',
            competenciaFin: datos.competicion_fin?.split('T')[0] || '',
            areas: areasNombres,
          });
        } catch (error) {
          console.error('Error al cargar la convocatoria:', error);
        }
      }
    };

    if (visible) {
      cargarConvocatoria();
    }
  }, [convocatoria, visible]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    
    // Clear the specific error when a field is changed
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const manejarCheckbox = (area) => {
    const seleccionadas = formulario.areas.includes(area)
      ? formulario.areas.filter(a => a !== area)
      : [...formulario.areas, area];

    setFormulario({ ...formulario, areas: seleccionadas });
    
    // Clear the areas error if at least one area is selected
    if (errores.areas && seleccionadas.length > 0) {
      setErrores({ ...errores, areas: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    
    const fechaInicioInscripcion = formulario.inscripcionInicio ? new Date(formulario.inscripcionInicio) : null;
    const fechaFinInscripcion = formulario.inscripcionFin ? new Date(formulario.inscripcionFin) : null;
    const fechaInicioPago = formulario.pagoInicio ? new Date(formulario.pagoInicio) : null;
    const fechaFinPago = formulario.pagoFin ? new Date(formulario.pagoFin) : null;
    const fechaInicioCompetencia = formulario.competenciaInicio ? new Date(formulario.competenciaInicio) : null;
    const fechaFinCompetencia = formulario.competenciaFin ? new Date(formulario.competenciaFin) : null;
  
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre de la convocatoria es obligatorio.';
    } else if (formulario.nombre.length > 100) {
      nuevosErrores.nombre = 'Máximo 100 caracteres.';
    }
  
    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria.';
    } else if (formulario.descripcion.length > 1000) {
      nuevosErrores.descripcion = 'Máximo 1000 caracteres.';
    }
  
    // Only validate future dates for new convocatorias, not when editing existing ones
    if (!formulario.inscripcionInicio) {
      nuevosErrores.inscripcionInicio = 'Ingrese el inicio de inscripción.';
    } else if (!convocatoria?.id && fechaInicioInscripcion < hoy) {
      nuevosErrores.inscripcionInicio = 'La fecha de inicio de inscripción debe ser mayor a la fecha de hoy.';
    }
  
    if (!formulario.inscripcionFin) {
      nuevosErrores.inscripcionFin = 'Ingrese el fin de inscripción.';
    } else if (fechaFinInscripcion && fechaInicioInscripcion && fechaFinInscripcion <= fechaInicioInscripcion) {
      nuevosErrores.inscripcionFin = 'La fecha fin de inscripción debe ser mayor a la fecha de inicio.';
    }
  
    if (!formulario.pagoInicio) {
      nuevosErrores.pagoInicio = 'Ingrese el inicio del periodo de pago.';
    } else if (fechaInicioPago && fechaFinInscripcion && fechaInicioPago < fechaFinInscripcion) {
      nuevosErrores.pagoInicio = 'La fecha de inicio de pago debe ser igual o posterior al fin de inscripción.';
    }
  
    if (!formulario.pagoFin) {
      nuevosErrores.pagoFin = 'Ingrese el fin del periodo de pago.';
    } else if (fechaFinPago && fechaInicioPago && fechaFinPago <= fechaInicioPago) {
      nuevosErrores.pagoFin = 'La fecha fin de pago debe ser posterior al inicio de pago.';
    }
  
    if (!formulario.competenciaInicio) {
      nuevosErrores.competenciaInicio = 'Ingrese el inicio de competencia.';
    } else if (fechaInicioCompetencia && fechaFinPago && fechaInicioCompetencia < fechaFinPago) {
      nuevosErrores.competenciaInicio = 'El inicio de competencia debe ser igual o posterior al fin del periodo de pago.';
    }
  
    if (!formulario.competenciaFin) {
      nuevosErrores.competenciaFin = 'Ingrese el fin de competencia.';
    } else if (fechaFinCompetencia && fechaInicioCompetencia && fechaFinCompetencia <= fechaInicioCompetencia) {
      nuevosErrores.competenciaFin = 'La fecha fin de competencia debe ser mayor al inicio de competencia.';
    }
  
    if (formulario.areas.length === 0) {
      nuevosErrores.areas = 'Debe seleccionar al menos un área.';
    }
  
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    guardar({
      ...formulario,
      areasSeleccionadas: formulario.areas,
      areas: formulario.areas.length
    });
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-convocatoria">
        <h3>Editar Convocatoria</h3>
        <p>Complete la información para actualizar una convocatoria</p>

        <form className="modal-form" onSubmit={manejarSubmit}>
          <div className="input-row">
            <div className="form-group">
              <label>Nombre de la Convocatoria *</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                maxLength={100}
                className={errores.nombre ? 'input-error' : ''}
              />
              {errores.nombre && <span className="error-text">{errores.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select name="estado" value={formulario.estado} onChange={manejarCambio}>
                <option value="Borrador">Borrador</option>
                <option value="En inscripción">En inscripción</option>
                <option value="En competencia">En competencia</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              maxLength={1000}
              className={errores.descripcion ? 'input-error' : ''}
            />
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Fecha Inicio Inscripción *</label>
              <input
                type="date"
                name="inscripcionInicio"
                value={formulario.inscripcionInicio}
                onChange={manejarCambio}
                className={errores.inscripcionInicio ? 'input-error' : ''}
              />
              {errores.inscripcionInicio && <span className="error-text">{errores.inscripcionInicio}</span>}
            </div>
            <div className="form-group">
              <label>Fecha Fin Inscripción *</label>
              <input
                type="date"
                name="inscripcionFin"
                value={formulario.inscripcionFin}
                onChange={manejarCambio}
                className={errores.inscripcionFin ? 'input-error' : ''}
              />
              {errores.inscripcionFin && <span className="error-text">{errores.inscripcionFin}</span>}
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Fecha Inicio Pago *</label>
              <input
                type="date"
                name="pagoInicio"
                value={formulario.pagoInicio}
                onChange={manejarCambio}
                className={errores.pagoInicio ? 'input-error' : ''}
              />
              {errores.pagoInicio && <span className="error-text">{errores.pagoInicio}</span>}
            </div>
            <div className="form-group">
              <label>Fecha Fin Pago *</label>
              <input
                type="date"
                name="pagoFin"
                value={formulario.pagoFin}
                onChange={manejarCambio}
                className={errores.pagoFin ? 'input-error' : ''}
              />
              {errores.pagoFin && <span className="error-text">{errores.pagoFin}</span>}
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Fecha Inicio Competencia *</label>
              <input
                type="date"
                name="competenciaInicio"
                value={formulario.competenciaInicio}
                onChange={manejarCambio}
                className={errores.competenciaInicio ? 'input-error' : ''}
              />
              {errores.competenciaInicio && <span className="error-text">{errores.competenciaInicio}</span>}
            </div>
            <div className="form-group">
              <label>Fecha Fin Competencia *</label>
              <input
                type="date"
                name="competenciaFin"
                value={formulario.competenciaFin}
                onChange={manejarCambio}
                className={errores.competenciaFin ? 'input-error' : ''}
              />
              {errores.competenciaFin && <span className="error-text">{errores.competenciaFin}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Áreas de Competencia *</label>
            <div className={`modal-areas ${errores.areas ? 'input-error' : ''}`}>
              {areasDisponibles.map((area) => (
                <label className="checkbox-area" key={area}>
                  <input
                    type="checkbox"
                    checked={formulario.areas.includes(area)}
                    onChange={() => manejarCheckbox(area)}
                  />
                  {area}
                </label>
              ))}
            </div>
            {errores.areas && <span className="error-text">{errores.areas}</span>}
          </div>

          <div className="modal-botones">
            <button type="button" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="btn-crear">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarConvocatoria;