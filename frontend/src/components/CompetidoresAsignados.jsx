import React from "react";
import { RefreshCw } from "lucide-react";
import { useCompetidoresAsignados } from "../hooks/useCompetidoresAsignados";
import "../styles/CompetidoresAsignados.css";

const CompetidoresAsignados = () => {
  const { competidores, cargando, error, actualizarCompetidores } =
    useCompetidoresAsignados();

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
      case "rechazada":
        return "estado-rechazada";  
    }
  };

  return (
    <div className="competidores-asignados-container">
      <div className="competidores-asignados-header">
        <h2>Mis Competidores Asignados</h2>
        <button
          className="btn-actualizar"
          onClick={actualizarCompetidores}
          disabled={cargando}
        >
          <RefreshCw size={16} className={cargando ? "spinning" : ""} />
          {cargando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className="competidores-asignados-error">
          <p>{error}</p>
        </div>
      )}

      {cargando && !error ? (
        <div className="competidores-asignados-cargando">
          <p>Cargando competidores asignados...</p>
        </div>
      ) : competidores.length === 0 ? (
        <div className="competidores-asignados-vacio">
          <p>No tienes competidores asignados</p>
          <small>
            Los competidores que te seleccionen como tutor aparecerán aquí
          </small>
        </div>
      ) : (
        <div className="competidores-asignados-tabla-container">
          <table className="competidores-asignados-tabla">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Área</th>
                <th>Categoría</th>
                <th>Colegio</th>
                <th>Fecha Inscripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {competidores.map((competidor) => (
                <tr key={competidor.id}>
                  <td>
                    <div className="estudiante-info">
                      <strong>{competidor.estudiante}</strong>
                      <small>{competidor.email}</small>
                      <small>CI: {competidor.ci}</small>
                    </div>
                  </td>
                  <td>{competidor.area}</td>
                  <td>
                    {competidor.categoria}
                    <div>
                      <small>
                        {competidor.grado} de {competidor.nivel}
                      </small>
                    </div>
                  </td>
                  <td>{competidor.colegio}</td>
                  <td>{formatearFecha(competidor.fecha_inscripcion)}</td>
                  <td>
                    <span
                      className={`estado-badge ${getEstadoClase(
                        competidor.estado
                      )}`}
                    >
                      {competidor.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="competidores-asignados-info">
        <h3>¿Qué significan los estados?</h3>
        <ul className="estados-explicacion">
          <li>
            <span className="estado-badge estado-pendiente">Pendiente</span> La
            inscripción está en proceso de revisión.
          </li>
          <li>
            <span className="estado-badge estado-aprobado">Aprobado</span> La
            inscripción ha sido aprobada por todos los tutores.
          </li>
          <li>
            <span className="estado-badge estado-completado">Completado</span>{" "}
            El competidor ha completado todos los requisitos.
          </li>
          <li>
            <span className="estado-badge estado-rechazada">Rechazada</span> La
            inscripción ha sido rechazada.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CompetidoresAsignados;
