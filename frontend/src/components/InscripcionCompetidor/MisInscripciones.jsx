import React from "react";
import { useConsultaInscripciones } from "../../hooks/useConsultaInscripciones";
import "../../styles/InscripcionCompetidor/MisInscripciones.css";
import { RefreshCw } from "lucide-react";

const MisInscripciones = () => {
  const { inscripciones, cargando, error, actualizarInscripciones } =
    useConsultaInscripciones();

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "No registrada";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoClase = (estado) => {
    const estadoLower = estado?.toLowerCase();
    switch (estadoLower) {
      case "pendiente":
        return "estado-pendiente";
      case "aprobado":
        return "estado-aprobado";
      case "completado":
        return "estado-completado";
      case "cancelado":
        return "estado-cancelado";
      default:
        return "estado-pendiente";
    }
  };

  return (
    <div className="mis-inscripciones-container">
      <div className="mis-inscripciones-header">
        <h2>Mis Inscripciones</h2>
        <button
          className="btn-actualizar"
          onClick={actualizarInscripciones}
          disabled={cargando}
        >
          <RefreshCw size={16} className={cargando ? "spinning" : ""} />
          {cargando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className="mis-inscripciones-error">
          <p>{error}</p>
        </div>
      )}

      {cargando && !error ? (
        <div className="mis-inscripciones-cargando">
          <p>Cargando inscripciones...</p>
        </div>
      ) : inscripciones.length === 0 ? (
        <div className="mis-inscripciones-vacio">
          <p>No tienes inscripciones registradas</p>
          <small>Las inscripciones que realices aparecerán aquí</small>
        </div>
      ) : (
        <div className="mis-inscripciones-tabla-container">
          <table className="mis-inscripciones-tabla">
            <thead>
              <tr>
                <th>Área</th>
                <th>Categoría</th>
                <th>Convocatoria</th>
                <th>Fecha Inscripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((inscripcion) => (
                <tr key={inscripcion.id}>
                  <td>{inscripcion.area}</td>
                  <td>{inscripcion.categoria}</td>
                  <td>{inscripcion.convocatoria}</td>
                  <td>{formatearFecha(inscripcion.fecha_inscripcion)}</td>
                  <td>
                    <span
                      className={`estado-badge ${getEstadoClase(
                        inscripcion.estado
                      )}`}
                    >
                      {inscripcion.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mis-inscripciones-info">
        <h3>¿Qué significan los estados?</h3>
        <ul className="estados-explicacion">
          <li>
            <span className="estado-badge estado-pendiente">Pendiente</span> Tu
            inscripción está en proceso de revisión.
          </li>
          <li>
            <span className="estado-badge estado-aprobado">Aprobado</span> Tu
            inscripción ha sido aprobada por los tutores.
          </li>
          <li>
            <span className="estado-badge estado-completado">Completado</span>{" "}
            Has completado todos los requisitos.
          </li>
          <li>
            <span className="estado-badge estado-cancelado">Cancelado</span> La
            inscripción ha sido cancelada.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MisInscripciones;
