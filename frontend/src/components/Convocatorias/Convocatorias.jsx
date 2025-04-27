import React, { useState, useEffect } from "react";
import CardConvocatoria from "./CardConvocatoria";
import ModalNuevaConvocatoria from "./ModalNuevaConvocatoria";
import ModalVisualizarConvocatoria from "./ModalVisualizarConvocatoria";
import ModalEditarConvocatoria from "./ModalEditarConvocatoria";
import ModalEliminarConvocatoria from "./ModalEliminarConvocatoria";
import "../../styles/Convocatorias/Convocatorias.css";
import convocatoriaService from "../../services/convocatoriaService";

const Convocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarVisual, setMostrarVisual] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] =
    useState(null);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [convocatoriaEditando, setConvocatoriaEditando] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [convocatoriaAEliminar, setConvocatoriaAEliminar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar convocatorias desde el backend
  useEffect(() => {
    const cargarConvocatorias = async () => {
      try {
        setCargando(true);
        const data = await convocatoriaService.obtenerConvocatorias();

        // Transformar los datos si es necesario para que coincidan con la estructura esperada
        const convocatoriasFormateadas = data.map((conv) => ({
          id: conv.id,
          nombre: conv.nombre_convocatoria,
          descripcion: conv.descripcion_convocatoria,
          inscripcionInicio: new Date(conv.fecha_inicio).toLocaleDateString(
            "es-ES"
          ),
          inscripcionFin: new Date(conv.fecha_fin).toLocaleDateString("es-ES"),
          competenciaInicio: new Date(
            conv.competicion_inicio
          ).toLocaleDateString("es-ES"),
          competenciaFin: new Date(conv.competicion_fin).toLocaleDateString(
            "es-ES"
          ),
          estado:
            conv.id_estado_convocatoria === 1
              ? "En inscripción"
              : conv.id_estado_convocatoria === 2
              ? "En competencia"
              : "Finalizada",
          // Nota: Para obtener las áreas relacionadas, necesitaríamos hacer una llamada adicional
          // o modificar el endpoint para incluir esta información
        }));

        setConvocatorias(convocatoriasFormateadas);
        setError(null);
      } catch (error) {
        console.error("Error al cargar convocatorias:", error);
        setError(
          "Error al cargar convocatorias. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarConvocatorias();
  }, []);

  const agregarConvocatoria = async (nueva) => {
    try {
      // Transformar datos para que coincidan con la estructura esperada por el backend
      const datosConvocatoria = {
        nombre_convocatoria: nueva.nombre,
        descripcion_convocatoria: nueva.descripcion,
        fecha_inicio: nueva.inscripcionInicio,
        fecha_fin: nueva.inscripcionFin,
        competicion_inicio: nueva.competenciaInicio,
        competicion_fin: nueva.competenciaFin,
        id_estado_convocatoria:
          nueva.estado === "En inscripción"
            ? 1
            : nueva.estado === "En competencia"
            ? 2
            : 3,
        areaIds: nueva.areasSeleccionadas, // Suponiendo que son IDs
      };

      const response = await convocatoriaService.crearConvocatoria(
        datosConvocatoria
      );

      // Recargar convocatorias después de crear una nueva
      const data = await convocatoriaService.obtenerConvocatorias();
      const convocatoriasFormateadas = data.map((conv) => ({
        id: conv.id,
        nombre: conv.nombre_convocatoria,
        descripcion: conv.descripcion_convocatoria,
        inscripcionInicio: new Date(conv.fecha_inicio).toLocaleDateString(
          "es-ES"
        ),
        inscripcionFin: new Date(conv.fecha_fin).toLocaleDateString("es-ES"),
        competenciaInicio: new Date(conv.competicion_inicio).toLocaleDateString(
          "es-ES"
        ),
        competenciaFin: new Date(conv.competicion_fin).toLocaleDateString(
          "es-ES"
        ),
        estado:
          conv.id_estado_convocatoria === 1
            ? "En inscripción"
            : conv.id_estado_convocatoria === 2
            ? "En competencia"
            : "Finalizada",
      }));

      setConvocatorias(convocatoriasFormateadas);
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al crear convocatoria:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const filtrarConvocatorias = () => {
    if (filtroEstado === "Todos") return convocatorias;
    return convocatorias.filter((c) => c.estado === filtroEstado);
  };

  const handleVer = async (convocatoria) => {
    try {
      // Obtener detalles adicionales de la convocatoria si es necesario
      const detallesConvocatoria =
        await convocatoriaService.obtenerConvocatoriaConAreas(convocatoria.id);
      setConvocatoriaSeleccionada({
        ...convocatoria,
        areasDetalladas:
          detallesConvocatoria.Area_convocatoria?.map((ac) => ac.area) || [],
      });
      setMostrarVisual(true);
    } catch (error) {
      console.error("Error al obtener detalles de la convocatoria:", error);
    }
  };

  const handleEditar = async (convocatoria) => {
    try {
      // Obtener detalles adicionales de la convocatoria para edición
      const detallesConvocatoria =
        await convocatoriaService.obtenerConvocatoriaConAreas(convocatoria.id);
      setConvocatoriaEditando({
        ...convocatoria,
        areasSeleccionadas:
          detallesConvocatoria.Area_convocatoria?.map((ac) => ac.area_id) || [],
      });
      setMostrarEditar(true);
    } catch (error) {
      console.error("Error al obtener detalles para edición:", error);
    }
  };

  const actualizarConvocatoria = async (actualizada) => {
    try {
      // Transformar datos para actualización
      const datosActualizacion = {
        nombre_convocatoria: actualizada.nombre,
        descripcion_convocatoria: actualizada.descripcion,
        fecha_inicio: actualizada.inscripcionInicio,
        fecha_fin: actualizada.inscripcionFin,
        competicion_inicio: actualizada.competenciaInicio,
        competicion_fin: actualizada.competenciaFin,
        id_estado_convocatoria:
          actualizada.estado === "En inscripción"
            ? 1
            : actualizada.estado === "En competencia"
            ? 2
            : 3,
        areaIds: actualizada.areasSeleccionadas,
      };

      await convocatoriaService.actualizarConvocatoria(
        actualizada.id,
        datosActualizacion
      );

      // Recargar convocatorias
      const data = await convocatoriaService.obtenerConvocatorias();
      const convocatoriasFormateadas = data.map((conv) => ({
        id: conv.id,
        nombre: conv.nombre_convocatoria,
        descripcion: conv.descripcion_convocatoria,
        inscripcionInicio: new Date(conv.fecha_inicio).toLocaleDateString(
          "es-ES"
        ),
        inscripcionFin: new Date(conv.fecha_fin).toLocaleDateString("es-ES"),
        competenciaInicio: new Date(conv.competicion_inicio).toLocaleDateString(
          "es-ES"
        ),
        competenciaFin: new Date(conv.competicion_fin).toLocaleDateString(
          "es-ES"
        ),
        estado:
          conv.id_estado_convocatoria === 1
            ? "En inscripción"
            : conv.id_estado_convocatoria === 2
            ? "En competencia"
            : "Finalizada",
      }));

      setConvocatorias(convocatoriasFormateadas);
      setMostrarEditar(false);
    } catch (error) {
      console.error("Error al actualizar convocatoria:", error);
    }
  };

  const handleEliminar = (convocatoria) => {
    setConvocatoriaAEliminar(convocatoria);
    setMostrarEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      // Nota: Se necesitaría un endpoint para eliminar convocatorias
      // Por ahora, solo actualizamos el estado local
      setConvocatorias((prev) =>
        prev.filter((c) => c.id !== convocatoriaAEliminar.id)
      );
      setMostrarEliminar(false);
    } catch (error) {
      console.error("Error al eliminar convocatoria:", error);
    }
  };

  if (cargando)
    return <div className="cargando">Cargando convocatorias...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="convocatorias-wrapper">
      <div className="convocatorias-header">
        <h2>Gestión de Convocatorias</h2>
        <button className="btn-nueva" onClick={() => setMostrarModal(true)}>
          + Nueva Convocatoria
        </button>
      </div>

      <div className="filtro-convocatorias">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="En inscripción">En inscripción</option>
          <option value="En competencia">En competencia</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>

      <div className="lista-convocatorias">
        {filtrarConvocatorias().map((convocatoria) => (
          <CardConvocatoria
            key={convocatoria.id}
            data={convocatoria}
            onVer={handleVer}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        ))}
      </div>

      {mostrarModal && (
        <ModalNuevaConvocatoria
          visible={mostrarModal}
          cerrar={() => setMostrarModal(false)}
          agregar={agregarConvocatoria}
        />
      )}

      {mostrarVisual && (
        <ModalVisualizarConvocatoria
          visible={mostrarVisual}
          convocatoria={convocatoriaSeleccionada}
          cerrar={() => setMostrarVisual(false)}
        />
      )}

      {mostrarEditar && (
        <ModalEditarConvocatoria
          visible={mostrarEditar}
          convocatoria={convocatoriaEditando}
          cerrar={() => setMostrarEditar(false)}
          guardar={actualizarConvocatoria}
        />
      )}

      {mostrarEliminar && (
        <ModalEliminarConvocatoria
          visible={mostrarEliminar}
          cerrar={() => setMostrarEliminar(false)}
          confirmar={confirmarEliminacion}
          convocatoria={convocatoriaAEliminar}
        />
      )}
    </div>
  );
};

export default Convocatorias;
