import React, { useState, useEffect } from "react";
import "../../styles/Convocatorias/ModalNuevaConvocatoria.css";
import areaService from "../../services/areaService";

const ModalEditarConvocatoria = ({
  visible,
  cerrar,
  convocatoria,
  guardar,
}) => {
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
  });

  const [errores, setErrores] = useState({});
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);

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

  // Cargar datos de convocatoria al editar
  useEffect(() => {
    if (convocatoria && areasDisponibles.length > 0) {
      // Transformar las fechas del formato dd/mm/aaaa a aaaa-mm-dd para inputs de tipo date
      const transformarFecha = (fechaStr) => {
        if (!fechaStr) return "";
        const partes = fechaStr.split("/");
        if (partes.length !== 3) return "";
        return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(
          2,
          "0"
        )}`;
      };

      // Obtener los IDs de las áreas a partir de los nombres, si los hay
      const areaIds = convocatoria.areasSeleccionadas || [];

      setFormulario({
        id: convocatoria.id,
        nombre: convocatoria.nombre || "",
        estado: convocatoria.estado || "En inscripción",
        descripcion: convocatoria.descripcion || "",
        inscripcionInicio: transformarFecha(convocatoria.inscripcionInicio),
        inscripcionFin: transformarFecha(convocatoria.inscripcionFin),
        competenciaInicio: transformarFecha(convocatoria.competenciaInicio),
        competenciaFin: transformarFecha(convocatoria.competenciaFin),
        areas: areasDisponibles
          .filter((area) => areaIds.includes(area.id))
          .map((area) => area.nombre_area),
        areasSeleccionadas: areaIds,
      });
    }
  }, [convocatoria, areasDisponibles]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
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
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre la convocatoria es obligatorio.";
    } else if (formulario.nombre.length > 100) {
      nuevosErrores.nombre = "Máximo 100 caracteres.";
    }

    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria.";
    } else if (formulario.descripcion.length > 1000) {
      nuevosErrores.descripcion = "Máximo 1000 caracteres.";
    }

    if (!formulario.inscripcionInicio)
      nuevosErrores.inscripcionInicio = "Ingrese el inicio de inscripcion.";
    if (!formulario.inscripcionFin)
      nuevosErrores.inscripcionFin = "Ingrese el fin de inscripcion.";
    if (!formulario.competenciaInicio)
      nuevosErrores.competenciaInicio = "Ingrese el inicio de la competencia.";
    if (!formulario.competenciaFin)
      nuevosErrores.competenciaFin = "Ingrese el fin de la competencia.";

    if (formulario.areasSeleccionadas.length === 0) {
      nuevosErrores.areas = "Debe seleccionar al menos un área.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

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
              className={errores.descripcion ? "input-error" : ""}
            />
            {errores.descripcion && (
              <span className="error-text">{errores.descripcion}</span>
            )}
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Fecha Inicio Inscripción *</label>
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
              <label>Fecha Fin Inscripción *</label>
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
              <label>Fecha Inicio Competencia *</label>
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
              <label>Fecha Fin Competencia *</label>
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

          <div className="form-group full-width">
            <label>Áreas de Competencia *</label>
            <div
              className={`modal-areas ${errores.areas ? "input-error" : ""}`}
            >
              {areasDisponibles.map((area) => (
                <label className="checkbox-area" key={area.id}>
                  <input
                    type="checkbox"
                    checked={formulario.areasSeleccionadas.includes(area.id)}
                    onChange={() => manejarCheckbox(area.id, area.nombre_area)}
                  />
                  {area.nombre_area}
                </label>
              ))}
            </div>
            {errores.areas && (
              <span className="error-text">{errores.areas}</span>
            )}
          </div>

          <div className="modal-botones">
            <button type="button" onClick={cerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-crear">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarConvocatoria;
