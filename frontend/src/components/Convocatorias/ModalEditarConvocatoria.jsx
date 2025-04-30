import React, { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import "../../styles/Convocatorias/ModalNuevaConvocatoria.css";
import areaService from "../../services/areaService";

const ModalEditarConvocatoria = ({
  visible,
  cerrar,
  convocatoria,
  guardar,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    inscripcionInicio: "",
    inscripcionFin: "",
    competenciaInicio: "",
    competenciaFin: "",
    estado: "",
    areasSeleccionadas: [],
  });

  const [areas, setAreas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (convocatoria) {
      // Convertir fechas a formato yyyy-MM-dd para inputs de tipo date
      const convertirFecha = (fechaStr) => {
        try {
          // Intentar parsear como dd/MM/yyyy primero (formato mostrado en la interfaz)
          const fecha = parse(fechaStr, "dd/MM/yyyy", new Date());
          return format(fecha, "yyyy-MM-dd");
        } catch (e) {
          // Si falla, intentar con el formato original
          return fechaStr;
        }
      };

      setFormData({
        id: convocatoria.id,
        nombre: convocatoria.nombre,
        descripcion: convocatoria.descripcion,
        inscripcionInicio: convertirFecha(convocatoria.inscripcionInicio),
        inscripcionFin: convertirFecha(convocatoria.inscripcionFin),
        competenciaInicio: convertirFecha(convocatoria.competenciaInicio),
        competenciaFin: convertirFecha(convocatoria.competenciaFin),
        estado: convocatoria.estado,
        areasSeleccionadas: convocatoria.areasSeleccionadas || [],
      });
    }

    const cargarAreas = async () => {
      try {
        const areasData = await areaService.obtenerAreas();
        setAreas(areasData);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        setError("No se pudieron cargar las áreas. Intente de nuevo.");
      }
    };

    cargarAreas();
  }, [convocatoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckbox = (areaId) => {
    const isSelected = formData.areasSeleccionadas.includes(areaId);
    let nuevasAreas;

    if (isSelected) {
      nuevasAreas = formData.areasSeleccionadas.filter((id) => id !== areaId);
    } else {
      nuevasAreas = [...formData.areasSeleccionadas, areaId];
    }

    setFormData({
      ...formData,
      areasSeleccionadas: nuevasAreas,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que las fechas tengan sentido
    if (
      new Date(formData.inscripcionInicio) >= new Date(formData.inscripcionFin)
    ) {
      setError(
        "La fecha de inicio de inscripción debe ser anterior a la fecha de fin."
      );
      return;
    }

    if (
      new Date(formData.inscripcionFin) >= new Date(formData.competenciaInicio)
    ) {
      setError(
        "La fecha de fin de inscripción debe ser anterior a la fecha de inicio de competencia."
      );
      return;
    }

    if (
      new Date(formData.competenciaInicio) >= new Date(formData.competenciaFin)
    ) {
      setError(
        "La fecha de inicio de competencia debe ser anterior a la fecha de fin."
      );
      return;
    }

    if (formData.areasSeleccionadas.length === 0) {
      setError("Debe seleccionar al menos un área para la convocatoria.");
      return;
    }

    guardar(formData);
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Convocatoria</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="inscripcionInicio">Inicio inscripción:</label>
              <input
                type="date"
                id="inscripcionInicio"
                name="inscripcionInicio"
                value={formData.inscripcionInicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inscripcionFin">Fin inscripción:</label>
              <input
                type="date"
                id="inscripcionFin"
                name="inscripcionFin"
                value={formData.inscripcionFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="competenciaInicio">Inicio competencia:</label>
              <input
                type="date"
                id="competenciaInicio"
                name="competenciaInicio"
                value={formData.competenciaInicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="competenciaFin">Fin competencia:</label>
              <input
                type="date"
                id="competenciaFin"
                name="competenciaFin"
                value={formData.competenciaFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Áreas:</label>
            <div className="areas-container">
              {areas.map((area) => (
                <div key={area.id} className="area-checkbox">
                  <input
                    type="checkbox"
                    id={`area-${area.id}`}
                    checked={formData.areasSeleccionadas.includes(area.id)}
                    onChange={() => handleCheckbox(area.id)}
                  />
                  <label htmlFor={`area-${area.id}`}>{area.nombre_area}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={cerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarConvocatoria;
