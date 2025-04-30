<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "../../styles/Convocatorias/ModalNuevaConvocatoria.css";
import areaService from "../../services/areaService";

const ModalNuevaConvocatoria = ({ visible, cerrar, guardar }) => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    estado: "Borrador",
    descripcion: "",
    inscripcionInicio: "",
    inscripcionFin: "",
    competenciaInicio: "",
    competenciaFin: "",
    areas: [],
    areasSeleccionadas: [],
=======
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
    competenciaInicio: '',
    competenciaFin: '',
    areasSeleccionadas: []
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
  });

  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [estadosDisponibles, setEstadosDisponibles] = useState([]);
  const [errores, setErrores] = useState({});
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);

<<<<<<< HEAD
  // Cargar áreas desde el backend
  useEffect(() => {
    const cargarAreas = async () => {
      try {
        setCargando(true);
        const data = await areaService.obtenerAreas();
        setAreasDisponibles(data);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarAreas();
  }, []);
=======
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
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
<<<<<<< HEAD
    setErrores({ ...errores, [name]: "" });
  };

  const manejarCheckbox = (areaId, areaNombre) => {
    let nuevasAreas;
    let nuevosIds;

    if (formulario.areasSeleccionadas.includes(areaId)) {
      // Si ya está seleccionada, la quitamos
      nuevasAreas = formulario.areas.filter((a) => a !== areaNombre);
      nuevosIds = formulario.areasSeleccionadas.filter((id) => id !== areaId);
    } else {
      // Si no está seleccionada, la añadimos
      nuevasAreas = [...formulario.areas, areaNombre];
      nuevosIds = [...formulario.areasSeleccionadas, areaId];
    }

    setFormulario({
      ...formulario,
      areas: nuevasAreas,
      areasSeleccionadas: nuevosIds,
    });
    setErrores({ ...errores, areas: "" });
=======
    setErrores({ ...errores, [name]: '' });
  };

  const manejarCheckbox = (idArea) => {
    const seleccionadas = formulario.areasSeleccionadas.includes(idArea)
      ? formulario.areasSeleccionadas.filter(a => a !== idArea)
      : [...formulario.areasSeleccionadas, idArea];

    setFormulario({ ...formulario, areasSeleccionadas: seleccionadas });
    setErrores({ ...errores, areasSeleccionadas: '' });
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

<<<<<<< HEAD
    const fechaInicioInscripcion = formulario.inscripcionInicio
      ? new Date(formulario.inscripcionInicio)
      : null;
    const fechaFinInscripcion = formulario.inscripcionFin
      ? new Date(formulario.inscripcionFin)
      : null;
    const fechaInicioCompetencia = formulario.competenciaInicio
      ? new Date(formulario.competenciaInicio)
      : null;
    const fechaFinCompetencia = formulario.competenciaFin
      ? new Date(formulario.competenciaFin)
      : null;

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre de la convocatoria es obligatorio.";
    } else if (formulario.nombre.length > 100) {
      nuevosErrores.nombre = "Máximo 100 caracteres.";
    }

    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria.";
    } else if (formulario.descripcion.length > 1000) {
      nuevosErrores.descripcion = "Máximo 1000 caracteres.";
    }

    if (!formulario.inscripcionInicio) {
      nuevosErrores.inscripcionInicio = "Ingrese el inicio de inscripción.";
    } else if (fechaInicioInscripcion < hoy) {
      nuevosErrores.inscripcionInicio =
        "La fecha de inicio de inscripción debe ser mayor a la fecha de hoy.";
    }

    if (!formulario.inscripcionFin) {
      nuevosErrores.inscripcionFin = "Ingrese el fin de inscripción.";
    } else if (
      fechaFinInscripcion &&
      fechaInicioInscripcion &&
      fechaFinInscripcion <= fechaInicioInscripcion
    ) {
      nuevosErrores.inscripcionFin =
        "La fecha fin de inscripción debe ser mayor a la fecha de inicio.";
    }

    if (!formulario.competenciaInicio) {
      nuevosErrores.competenciaInicio = "Ingrese el inicio de competencia.";
    } else if (
      fechaInicioCompetencia &&
      fechaFinInscripcion &&
      fechaInicioCompetencia <= fechaFinInscripcion
    ) {
      nuevosErrores.competenciaInicio =
        "La fecha inicio de competencia debe ser después del fin de inscripción.";
    }

    if (!formulario.competenciaFin) {
      nuevosErrores.competenciaFin = "Ingrese el fin de competencia.";
    } else if (
      fechaFinCompetencia &&
      fechaInicioCompetencia &&
      fechaFinCompetencia <= fechaInicioCompetencia
    ) {
      nuevosErrores.competenciaFin =
        "La fecha fin de competencia debe ser mayor al inicio de competencia.";
    }

    if (formulario.areasSeleccionadas.length === 0) {
      nuevosErrores.areas = "Debe seleccionar al menos un área.";
    }
=======
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'Nombre obligatorio';
    if (!formulario.descripcion.trim()) nuevosErrores.descripcion = 'Descripción obligatoria';
    if (!formulario.inscripcionInicio) nuevosErrores.inscripcionInicio = 'Fecha inicio inscripción obligatoria';
    if (!formulario.inscripcionFin) nuevosErrores.inscripcionFin = 'Fecha fin inscripción obligatoria';
    if (!formulario.competenciaInicio) nuevosErrores.competenciaInicio = 'Fecha inicio competencia obligatoria';
    if (!formulario.competenciaFin) nuevosErrores.competenciaFin = 'Fecha fin competencia obligatoria';
    if (!formulario.id_estado_convocatoria) nuevosErrores.id_estado_convocatoria = 'Seleccione un estado';
    if (formulario.areasSeleccionadas.length === 0) nuevosErrores.areasSeleccionadas = 'Selecciona al menos un área';
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

<<<<<<< HEAD
    guardar({
      id: formulario.id,
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      estado: formulario.estado,
      inscripcionInicio: formulario.inscripcionInicio,
      inscripcionFin: formulario.inscripcionFin,
      competenciaInicio: formulario.competenciaInicio,
      competenciaFin: formulario.competenciaFin,
      areasSeleccionadas: formulario.areasSeleccionadas,
      areas: formulario.areasSeleccionadas.length,
    });
=======
    try {
      const convocatoriaAEnviar = {
        nombre_convocatoria: formulario.nombre,
        id_estado_convocatoria: parseInt(formulario.id_estado_convocatoria),
        fecha_inicio: new Date(formulario.inscripcionInicio).toISOString(),
        fecha_fin: new Date(formulario.inscripcionFin).toISOString(),
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
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
  };

  if (!visible) return null;
  if (cargando)
    return (
      <div className="modal-overlay">
        <div className="modal-convocatoria">
          <p>Cargando...</p>
        </div>
      </div>
    );

  return (
    <div className="modal-overlay">
      <div className="modal-convocatoria">
        <h3>Nueva Convocatoria</h3>
<<<<<<< HEAD
        <p>Complete la información para crear una nueva convocatoria</p>

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
                className={errores.nombre ? "input-error" : ""}
              />
              {errores.nombre && (
                <span className="error-text">{errores.nombre}</span>
              )}
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select
                name="estado"
                value={formulario.estado}
                onChange={manejarCambio}
              >
                <option value="Borrador">Borrador</option>
                <option value="En inscripción">En inscripción</option>
                <option value="En competencia">En competencia</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
=======
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
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
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
<<<<<<< HEAD
              maxLength={1000}
              className={errores.descripcion ? "input-error" : ""}
=======
              className={errores.descripcion ? 'input-error' : ''}
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
            />
            {errores.descripcion && (
              <span className="error-text">{errores.descripcion}</span>
            )}
          </div>

          {/* Fechas */}
          <div className="input-row">
            <div className="form-group">
              <label>Inicio Inscripción *</label>
              <input
                type="date"
                name="inscripcionInicio"
                value={formulario.inscripcionInicio}
                onChange={manejarCambio}
                className={errores.inscripcionInicio ? "input-error" : ""}
              />
              {errores.inscripcionInicio && (
                <span className="error-text">{errores.inscripcionInicio}</span>
              )}
            </div>
            <div className="form-group">
              <label>Fin Inscripción *</label>
              <input
                type="date"
                name="inscripcionFin"
                value={formulario.inscripcionFin}
                onChange={manejarCambio}
                className={errores.inscripcionFin ? "input-error" : ""}
              />
              {errores.inscripcionFin && (
                <span className="error-text">{errores.inscripcionFin}</span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Inicio Competencia *</label>
              <input
                type="date"
                name="competenciaInicio"
                value={formulario.competenciaInicio}
                onChange={manejarCambio}
                className={errores.competenciaInicio ? "input-error" : ""}
              />
              {errores.competenciaInicio && (
                <span className="error-text">{errores.competenciaInicio}</span>
              )}
            </div>
            <div className="form-group">
              <label>Fin Competencia *</label>
              <input
                type="date"
                name="competenciaFin"
                value={formulario.competenciaFin}
                onChange={manejarCambio}
                className={errores.competenciaFin ? "input-error" : ""}
              />
              {errores.competenciaFin && (
                <span className="error-text">{errores.competenciaFin}</span>
              )}
            </div>
          </div>

          {/* Áreas */}
          <div className="form-group full-width">
            <label>Áreas de Competencia *</label>
<<<<<<< HEAD
            <div
              className={`modal-areas ${errores.areas ? "input-error" : ""}`}
            >
              {areasDisponibles.map((area) => (
                <label className="checkbox-area" key={area.id}>
                  <input
                    type="checkbox"
                    checked={formulario.areasSeleccionadas.includes(area.id)}
                    onChange={() => manejarCheckbox(area.id, area.nombre_area)}
=======
            <div className={`modal-areas ${errores.areasSeleccionadas ? 'input-error' : ''}`}>
              {areasDisponibles.map((area) => (
                <label key={area.id} className="checkbox-area">
                  <input
                    type="checkbox"
                    checked={formulario.areasSeleccionadas.includes(area.id)}
                    onChange={() => manejarCheckbox(area.id)}
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
                  />
                  {area.nombre_area}
                </label>
              ))}
            </div>
<<<<<<< HEAD
            {errores.areas && (
              <span className="error-text">{errores.areas}</span>
            )}
=======
            {errores.areasSeleccionadas && <span className="error-text">{errores.areasSeleccionadas}</span>}
>>>>>>> f6c725eaa42f28e8a1789abf571006ecec999d7c
          </div>

          {/* Botones */}
          <div className="modal-botones">
            <button type="button" onClick={cerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-crear">
              Crear
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalNuevaConvocatoria;

