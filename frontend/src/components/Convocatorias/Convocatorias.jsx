import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import "../../styles/Convocatorias/Convocatorias.css";
import ModalNuevaConvocatoria from "./ModalNuevaConvocatoria";
import ModalEditarConvocatoria from "./ModalEditarConvocatoria";
import TablaConvocatorias from "./TablaConvocatorias";
import useToast from "../../hooks/useToast";
import convocatoriaService from "../../services/convocatoriaService";
import MenuPrincipal from "../../components/MenuPrincipal";
import Loader from "../Loader";
import ModalConfirmacion from "../ModalConfirmacion";

const Convocatorias = () => {
  const { mostrarToast } = useToast();
  const [convocatorias, setConvocatorias] = useState([]);
  const [modalNueva, setModalNueva] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] =
    useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [convocatoriaEliminar, setConvocatoriaEliminar] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // Obtener convocatorias al cargar el componente
  useEffect(() => {
    cargarConvocatorias();
  }, []);

  // Función para cargar todas las convocatorias desde el servidor
  const cargarConvocatorias = async () => {
    try {
      setCargando(true);
      const data = await convocatoriaService.obtenerConvocatorias();
      if (data) {
        setConvocatorias(data);
      }
    } catch (error) {
      console.error("Error al obtener convocatorias:", error);
      mostrarToast("Error al cargar las convocatorias", "error");
    } finally {
      setCargando(false);
    }
  };

  // Función para crear una nueva convocatoria
  const crearConvocatoria = async (nuevaConvocatoria) => {
    try {
      const convocatoriaCreada = await convocatoriaService.crearConvocatoria(
        nuevaConvocatoria
      );
      setConvocatorias([...convocatorias, convocatoriaCreada]);
      mostrarToast("Convocatoria creada correctamente", "success");
      setModalNueva(false);
    } catch (error) {
      console.error("Error al crear convocatoria:", error);
      mostrarToast(
        error.response?.data?.message || "Error al crear la convocatoria",
        "error"
      );
    }
  };

  // Función para actualizar una convocatoria existente
  const actualizarConvocatoria = async (convocatoriaActualizada) => {
    try {
      await convocatoriaService.actualizarConvocatoria(
        convocatoriaActualizada.id,
        convocatoriaActualizada
      );

      const nuevasConvocatorias = convocatorias.map((item) =>
        item.id === convocatoriaActualizada.id ? convocatoriaActualizada : item
      );

      setConvocatorias(nuevasConvocatorias);
      mostrarToast("Convocatoria actualizada correctamente", "success");
      setModalEditar(false);
    } catch (error) {
      console.error("Error al actualizar convocatoria:", error);
      mostrarToast(
        error.response?.data?.message || "Error al actualizar la convocatoria",
        "error"
      );
    }
  };

  // Función para eliminar una convocatoria
  const eliminarConvocatoria = async () => {
    if (!convocatoriaEliminar) return;

    try {
      await convocatoriaService.eliminarConvocatoria(convocatoriaEliminar.id);
      setConvocatorias(
        convocatorias.filter((item) => item.id !== convocatoriaEliminar.id)
      );
      mostrarToast("Convocatoria eliminada correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar convocatoria:", error);
      mostrarToast(
        error.response?.data?.message || "Error al eliminar la convocatoria",
        "error"
      );
    } finally {
      setModalConfirmacion(false);
      setConvocatoriaEliminar(null);
    }
  };

  // Manejo de acciones en cada convocatoria
  const handleAccion = (accion, convocatoria) => {
    switch (accion) {
      case "editar":
        setConvocatoriaSeleccionada(convocatoria);
        setModalEditar(true);
        break;
      case "eliminar":
        setConvocatoriaEliminar(convocatoria);
        setModalConfirmacion(true);
        break;
      default:
        break;
    }
  };

  // Filtrar convocatorias por estado
  const convocatoriasFiltradas =
    filtroEstado === "Todos"
      ? convocatorias
      : convocatorias.filter((conv) => conv.estado === filtroEstado);

  // Botones de acciones para cada convocatoria
  const acciones = [
    {
      icono: <FaEye />,
      color: "icono-ver",
      accion: (id) => {
        window.location.href = `/convocatoria/${id}`;
      },
    },
    {
      icono: <FaPencilAlt />,
      color: "icono-editar",
      accion: (id) => {
        const convocatoria = convocatorias.find((c) => c.id === id);
        if (convocatoria) {
          handleAccion("editar", convocatoria);
        }
      },
    },
    {
      icono: <FaRegTrashAlt />,
      color: "icono-eliminar",
      accion: (id) => {
        const convocatoria = convocatorias.find((c) => c.id === id);
        if (convocatoria) {
          handleAccion("eliminar", convocatoria);
        }
      },
    },
  ];

  return (
    <div className="container-fluid convocatorias-page">
      <MenuPrincipal />
      <div className="convocatorias-container">
        <h1>Convocatorias</h1>

        <div className="convocatorias-header">
          <div className="convocatorias-filtros">
            <label>Filtrar por estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Borrador">Borrador</option>
              <option value="En inscripción">En inscripción</option>
              <option value="En competencia">En competencia</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>

          <button
            className="btn-nueva-convocatoria"
            onClick={() => setModalNueva(true)}
          >
            <AiOutlinePlus /> Nueva Convocatoria
          </button>
        </div>

        {cargando ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : convocatoriasFiltradas.length > 0 ? (
          <TablaConvocatorias
            convocatorias={convocatoriasFiltradas}
            acciones={acciones}
          />
        ) : (
          <div className="no-convocatorias">
            <p>No hay convocatorias disponibles para mostrar.</p>
            <button onClick={() => setModalNueva(true)}>
              Crear convocatoria
            </button>
          </div>
        )}
      </div>

      {modalNueva && (
        <ModalNuevaConvocatoria
          visible={modalNueva}
          cerrar={() => setModalNueva(false)}
          guardar={crearConvocatoria}
        />
      )}

      {modalEditar && convocatoriaSeleccionada && (
        <ModalEditarConvocatoria
          visible={modalEditar}
          cerrar={() => {
            setModalEditar(false);
            setConvocatoriaSeleccionada(null);
          }}
          guardar={actualizarConvocatoria}
          convocatoria={convocatoriaSeleccionada}
        />
      )}

      {modalConfirmacion && (
        <ModalConfirmacion
          visible={modalConfirmacion}
          titulo="Eliminar Convocatoria"
          mensaje={`¿Está seguro de eliminar la convocatoria "${convocatoriaEliminar?.nombre}"?`}
          onConfirmar={eliminarConvocatoria}
          onCancelar={() => {
            setModalConfirmacion(false);
            setConvocatoriaEliminar(null);
          }}
        />
      )}
    </div>
  );
};

export default Convocatorias;
