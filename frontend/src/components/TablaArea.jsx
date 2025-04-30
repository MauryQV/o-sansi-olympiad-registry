// TablaArea.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import ModalNuevaArea from "./ModalNuevaArea";
import ModalConfirmacionEliminar from "./ModalConfirmacionEliminar";
import ModalConfirmacionEliminarCategoria from "./ModalConfirmacionEliminarCategoria";
import ModalNuevaCategoria from "./ModalNuevaCategoria";
import "../styles/TablaArea.css";
import areaService from "../services/areaService";
import categoriaService from "../services/categoriaService";

const TablaArea = () => {
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarModalArea, setMostrarModalArea] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [areaAEliminar, setAreaAEliminar] = useState(null);
  const [indexAEliminar, setIndexAEliminar] = useState(null);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [areaActual, setAreaActual] = useState(null);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [areaEditandoIndex, setAreaEditandoIndex] = useState(null);
  const [mostrarConfirmacionCategoria, setMostrarConfirmacionCategoria] =
    useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [areaDeCategoria, setAreaDeCategoria] = useState(null);
  const [toastMensaje, setToastMensaje] = useState(null);
  const [modalKey, setModalKey] = useState(Date.now());

  // Cargar áreas desde el backend
  useEffect(() => {
    const cargarAreas = async () => {
      try {
        setCargando(true);
        const data = await areaService.obtenerAreas();
        setAreas(data);
        setError(null);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        setError(
          "Error al cargar áreas. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarAreas();
  }, []);

  const mostrarToast = (mensaje) => {
    setToastMensaje(mensaje);
    setTimeout(() => setToastMensaje(null), 2500);
  };

  const agregarArea = async (nuevaArea) => {
    try {
      if (areaEditandoIndex !== null) {
        // Actualizar área existente
        const areaActualizada = await areaService.actualizarArea(
          areas[areaEditandoIndex].id,
          nuevaArea
        );

        const nuevasAreas = [...areas];
        nuevasAreas[areaEditandoIndex] = areaActualizada;
        setAreas(nuevasAreas);
        setAreaEditandoIndex(null);
        mostrarToast("Área actualizada correctamente");
      } else {
        // Crear nueva área
        const areaCreada = await areaService.crearArea(nuevaArea);
        setAreas([...areas, areaCreada]);
        mostrarToast("Área creada correctamente");
      }
      setMostrarModalArea(false);
    } catch (error) {
      console.error("Error al guardar área:", error);
      mostrarToast("Error al guardar el área");
    }
  };

  const agregarCategoria = async (nuevaCategoria) => {
    try {
      const categoriaCreada = await categoriaService.crearCategoria(
        nuevaCategoria
      );

      // Refrescar la lista de áreas para mostrar la nueva categoría
      const data = await areaService.obtenerAreas();
      setAreas(data);

      mostrarToast("Categoría creada correctamente");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      mostrarToast("Error al crear la categoría");
    }
  };

  const actualizarCategoria = (categoriaActualizada) => {
    // Nota: La implementación de actualización de categoría puede requerir un endpoint
    // adicional en el backend que actualmente no existe
    const nuevasAreas = areas.map((area) => {
      if (area.nombre === categoriaActualizada.area) {
        const nuevasCategorias = area.categorias.map((cat) =>
          cat.nombre === categoriaEditando.nombre ? categoriaActualizada : cat
        );
        return { ...area, categorias: nuevasCategorias };
      }
      return area;
    });
    setAreas(nuevasAreas);
    setCategoriaEditando(null);
    mostrarToast("Categoría actualizada correctamente");
  };

  const eliminarCategoria = () => {
    // Nota: La implementación de eliminación de categoría puede requerir un endpoint
    // adicional en el backend que actualmente no existe
    const nuevasAreas = areas.map((area) => {
      if (area.nombre === areaDeCategoria) {
        const filtradas = area.categorias.filter(
          (cat) => cat.nombre !== categoriaAEliminar
        );
        return { ...area, categorias: filtradas };
      }
      return area;
    });
    setAreas(nuevasAreas);
    setMostrarConfirmacionCategoria(false);
    mostrarToast(`Categoría "${categoriaAEliminar}" eliminada correctamente`);
  };

  const editarArea = (index) => {
    setAreaEditandoIndex(index);
    setAreaActual(areas[index]);
    setMostrarModalArea(true);
  };

  const preguntarEliminar = (index) => {
    setIndexAEliminar(index);
    setAreaAEliminar(areas[index].nombre);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    // Nota: La implementación de eliminación de área puede requerir un endpoint
    // adicional en el backend que actualmente no existe
    // Por ahora, solo actualicamos el estado local
    setAreas(areas.filter((_, i) => i !== indexAEliminar));
    setMostrarConfirmacion(false);
    mostrarToast(`Área "${areaAEliminar}" eliminada correctamente`);
  };

  const cerrarModalCategoria = () => {
    setMostrarModalCategoria(false);
    setCategoriaEditando(null);
    setModalKey(Date.now());
  };

  if (cargando) return <div className="cargando">Cargando áreas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="contenedor-areas">
      <div className="encabezado">
        <h2>Áreas Científicas</h2>
        <button
          className="btn-nueva-area"
          onClick={() => {
            setAreaActual(null);
            setAreaEditandoIndex(null);
            setMostrarModalArea(true);
          }}
        >
          <FaPlus /> Nueva Área
        </button>
      </div>

      <div className="grid-areas">
        {areas.map((area, index) => (
          <div className="card-area" key={index}>
            <div className="card-header">
              <h3>{area.nombre_area}</h3>
              <div className="card-actions">
                <button onClick={() => editarArea(index)}>
                  <FaEdit />
                </button>
                <button onClick={() => preguntarEliminar(index)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <p>{area.descripcion_area}</p>

            {/* Mostrar Costo */}
            <p className="area-costo">
              Costo: <strong>{area.costo} Bs</strong>
            </p>

            {area.categorias && area.categorias.length > 0 && (
              <div className="categorias-box">
                <h4>Categorías / Niveles</h4>
                {area.categorias.map((cat, i) => (
                  <div key={i} className="categoria-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>{cat.nombre}</strong>
                      <div>
                        <button
                          onClick={() => {
                            setCategoriaEditando(cat);
                            setMostrarModalCategoria(true);
                          }}
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setCategoriaAEliminar(cat.nombre);
                            setAreaDeCategoria(area.nombre_area);
                            setMostrarConfirmacionCategoria(true);
                          }}
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", margin: 0 }}>
                      {cat.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn-categoria"
              onClick={() => {
                setAreaActual(area.nombre_area);
                setCategoriaEditando(null);
                setModalKey(Date.now());
                setMostrarModalCategoria(true);
              }}
            >
              <FaPlus /> Añadir Categoría
            </button>
          </div>
        ))}
      </div>

      {/* Toast de notificación */}
      {toastMensaje && <div className="toast-notificacion">{toastMensaje}</div>}

      {/* Modal para crear/editar áreas */}
      {mostrarModalArea && (
        <ModalNuevaArea
          mostrar={mostrarModalArea}
          cerrar={() => {
            setMostrarModalArea(false);
            setAreaEditandoIndex(null);
          }}
          agregarArea={agregarArea}
          areaAEditar={areaActual}
        />
      )}

      {/* Modal para eliminar áreas */}
      {mostrarConfirmacion && (
        <ModalConfirmacionEliminar
          mostrar={mostrarConfirmacion}
          cerrar={() => setMostrarConfirmacion(false)}
          confirmar={confirmarEliminacion}
          elemento={areaAEliminar}
          tipo="área"
        />
      )}

      {/* Modal para crear/editar categorías */}
      {mostrarModalCategoria && (
        <ModalNuevaCategoria
          key={modalKey}
          mostrar={mostrarModalCategoria}
          cerrar={cerrarModalCategoria}
          areasDisponibles={areas}
          areaSeleccionada={areaActual}
          onCrearCategoria={agregarCategoria}
          categoriaAEditar={categoriaEditando}
          onActualizarCategoria={actualizarCategoria}
        />
      )}

      {/* Modal para eliminar categorías */}
      {mostrarConfirmacionCategoria && (
        <ModalConfirmacionEliminarCategoria
          mostrar={mostrarConfirmacionCategoria}
          cerrar={() => setMostrarConfirmacionCategoria(false)}
          confirmar={eliminarCategoria}
          elemento={categoriaAEliminar}
        />
      )}
    </div>
  );
};

export default TablaArea;
