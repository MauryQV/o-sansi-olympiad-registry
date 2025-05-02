import React from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash, UserPlus } from "lucide-react";
import "../../styles/Convocatorias/CardConvocatoria.css";

const CardConvocatoria = ({ data, onVer, onEditar, onEliminar }) => {
  // Función para formatear fechas
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Determinar si el periodo de inscripción está activo
  const fechaActual = new Date();
  const inscripcionActiva =
    fechaActual >= new Date(data.fecha_inicio) &&
    fechaActual <= new Date(data.fecha_fin);

  // Colores según el estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case "BORRADOR":
        return "#FFD700";
      case "EN INSCRIPCION":
        return "#4CAF50";
      case "EN COMPETENCIA":
        return "#2196F3";
      case "FINALIZADA":
        return "#F44336";
      default:
        return "#999";
    }
  };

  return (
    <div className="card-convocatoria">
      <div className="card-header">
        <h3>{data.nombre}</h3>
        <span
          className="estado-badge"
          style={{ backgroundColor: getColorEstado(data.estado.nombre) }}
        >
          {data.estado.nombre}
        </span>
      </div>

      <div className="card-info">
        <p>
          <strong>Descripción:</strong> {data.descripcion.substring(0, 100)}...
        </p>
        <p>
          <strong>Inscripción:</strong> {formatearFecha(data.fecha_inicio)} -{" "}
          {formatearFecha(data.fecha_fin)}
        </p>
        <p>
          <strong>Competencia:</strong>{" "}
          {formatearFecha(data.competicion_inicio)} -{" "}
          {formatearFecha(data.competicion_fin)}
        </p>
      </div>
      <div className="card-actions">
        <button
          className="btn-accion btn-ver"
          onClick={() => onVer(data)}
          title="Ver detalles"
        >
          <Eye size={18} />
        </button>

        <button
          className="btn-accion btn-editar"
          onClick={() => onEditar(data)}
          disabled={data.estado.nombre === "FINALIZADA"}
          title="Editar convocatoria"
        >
          <Edit size={18} />
        </button>

        <button
          className="btn-accion btn-eliminar"
          onClick={() => onEliminar(data)}
          disabled={data.estado.nombre !== "BORRADOR"}
          title="Eliminar convocatoria"
        >
          <Trash size={18} />
        </button>

        {inscripcionActiva && (
          <Link
            to={`/inscripcion/${data.id}`}
            className="btn-accion btn-inscribir"
            title="Inscribirse"
          >
            <UserPlus size={18} />
          </Link>
        )}
      <div className="card-fecha">
        <span>Pago:</span>
        <span>{data.pagoInicio} - {data.pagoFin}</span>
      </div>
      <div className="card-fecha">
        <span>Competencia:</span>
        <span>{new Date(data.competicion_inicio).toLocaleDateString()} - {new Date(data.competicion_fin).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default CardConvocatoria;
