import React, { useState, useEffect } from 'react';
import { getAreas } from '../../services/areaService';
import { getEstadosConvocatoria } from '../../services/estadoService';
import { crearConvocatoria } from '../../services/convocatoriaService';
import '../../styles/Convocatorias/ModalNuevaConvocatoria.css';
import Swal from 'sweetalert2';

const ModalNuevaConvocatoria = ({ visible, cerrar, recargarConvocatorias }) => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    id_estado_convocatoria: '',
    descripcion: '',
    inscripcionInicio: '',
    inscripcionFin: '',
    pagoInicio: '',
    pagoFin: '',
    competenciaInicio: '',
    competenciaFin: '',
    areasSeleccionadas: []
  });

  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [estadosDisponibles, setEstadosDisponibles] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (visible) {
      cargarDatos();
    }
  }, [visible]);

  const cargarDatos = async () => {
    try {
      const [areas, estados] = await Promise.all([
        getAreas(),
        getEstadosConvocatoria()
      ]);
      setAreasDisponibles(areas);
      setEstadosDisponibles(estados);
    } catch (error) {
      console.error('Error cargando áreas o estados:', error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    setErrores({ ...errores, [name]: '' });
  };

  const manejarCheckbox = (idArea) => {
    const seleccionadas = formulario.areasSeleccionadas.includes(idArea)
      ? formulario.areasSeleccionadas.filter(a => a !== idArea)
      : [...formulario.areasSeleccionadas, idArea];

    setFormulario({ ...formulario, areasSeleccionadas: seleccionadas });
    setErrores({ ...errores, areasSeleccionadas: '' });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 

      if (!formulario.nombre.trim()) nuevosErrores.nombre = 'Nombre obligatorio';
    if (!formulario.descripcion.trim()) nuevosErrores.descripcion = 'Descripción obligatoria';
    if (!formulario.inscripcionInicio) nuevosErrores.inscripcionInicio = 'Fecha inicio inscripción obligatoria';
    if (!formulario.inscripcionFin) nuevosErrores.inscripcionFin = 'Fecha fin inscripción obligatoria';
    if (!formulario.pagoInicio) nuevosErrores.pagoInicio = 'Ingrese el inicio del periodo de pago.';
    if (!formulario.pagoFin) nuevosErrores.pagoFin = 'Ingrese el fin del periodo de pago.';
    if (!formulario.competenciaInicio) nuevosErrores.competenciaInicio = 'Fecha inicio competencia obligatoria';
    if (!formulario.competenciaFin) nuevosErrores.competenciaFin = 'Fecha fin competencia obligatoria';
    if (!formulario.id_estado_convocatoria) nuevosErrores.id_estado_convocatoria = 'Seleccione un estado';
    if (formulario.areasSeleccionadas.length === 0) nuevosErrores.areasSeleccionadas = 'Selecciona al menos un área';
  
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
  
    try {
      const convocatoriaAEnviar = {
        nombre_convocatoria: formulario.nombre,
        id_estado_convocatoria: parseInt(formulario.id_estado_convocatoria),
        fecha_inicio: new Date(formulario.inscripcionInicio).toISOString(),
        fecha_fin: new Date(formulario.inscripcionFin).toISOString(),
        pago_inicio: new Date(formulario.pagoInicio).toISOString(),
        pago_fin: new Date(formulario.pagoFin).toISOString(),
        competicion_inicio: new Date(formulario.competenciaInicio).toISOString(),
        competicion_fin: new Date(formulario.competenciaFin).toISOString(),
        descripcion_convocatoria: formulario.descripcion,
        areaIds: formulario.areasSeleccionadas
      };
  
      // Imprimir los datos que se enviarán al servidor
      console.log('Datos enviados al servidor:', convocatoriaAEnviar);
      await crearConvocatoria(convocatoriaAEnviar);
      Swal.fire('Éxito', 'Convocatoria creada correctamente', 'success');
      cerrar();
    } catch (error) {
      console.error('Error creando convocatoria:', error);
      Swal.fire('Error', 'No se pudo crear la convocatoria', 'error');
    }
  };
  
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-convocatoria">
        <h3>Nueva Convocatoria</h3>
        <form className="modal-form" onSubmit={manejarSubmit}>
          
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              className={errores.nombre ? 'input-error' : ''}
            />
            {errores.nombre && <span className="error-text">{errores.nombre}</span>}
          </div>

          {/* Estado */}
          <div className="form-group">
            <label>Estado *</label>
            <select
              name="id_estado_convocatoria"
              value={formulario.id_estado_convocatoria}
              onChange={manejarCambio}
              className={errores.id_estado_convocatoria ? 'input-error' : ''}
            >
              <option value="">Seleccione un estado</option>
              {estadosDisponibles.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
            {errores.id_estado_convocatoria && <span className="error-text">{errores.id_estado_convocatoria}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              className={errores.descripcion ? 'input-error' : ''}
            />
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </div>

          {/* Fechas */}
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
                className={errores?.pagoInicio ? 'input-error' : ''}
              />
              {errores?.pagoInicio && <span className="error-text">{errores.pagoInicio}</span>}
            </div>

            <div className="form-group">
              <label>Fecha Fin Pago *</label>
              <input
                type="date"
                name="pagoFin"
                value={formulario.pagoFin}
                onChange={manejarCambio}
                className={errores?.pagoFin ? 'input-error' : ''}
              />
              {errores?.pagoFin && <span className="error-text">{errores.pagoFin}</span>}
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

          {/* Áreas */}
          <div className="form-group full-width">
            <label>Áreas de Competencia *</label>
            <div className={`modal-areas ${errores.areasSeleccionadas ? 'input-error' : ''}`}>
              {areasDisponibles.map((area) => (
                <label key={area.id} className="checkbox-area">
                  <input
                    type="checkbox"
                    checked={formulario.areasSeleccionadas.includes(area.id)}
                    onChange={() => manejarCheckbox(area.id)}
                  />
                  {area.nombre_area}
                </label>
              ))}
            </div>
            {errores.areasSeleccionadas && <span className="error-text">{errores.areasSeleccionadas}</span>}
          </div>

          {/* Botones */}
          <div className="modal-botones">
            <button type="button" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="btn-crear">Crear</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalNuevaConvocatoria;

