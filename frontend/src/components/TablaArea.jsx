// TablaArea.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import ModalNuevaArea from './ModalNuevaArea';
import ModalConfirmacionEliminar from './ModalConfirmacionEliminar';
import ModalConfirmacionEliminarCategoria from './ModalConfirmacionEliminarCategoria';
import ModalNuevaCategoria from './ModalNuevaCategoria';
import '../styles/TablaArea.css';

const TablaArea = () => {
  const [areas, setAreas] = useState([
    { nombre: 'Matemática', descripcion: 'Olimpiada de Matemática con énfasis en el razonamiento lógico y la resolución de problemas.', categorias: [] },
    { nombre: 'Robótica', descripcion: 'Competencia de diseño, construcción y programación de robots para resolver desafíos específicos.', categorias: [] },
    { nombre: 'Astronomía y Astrofísica', descripcion: 'Estudio de cuerpos celestes, fenómenos astronómicos y la física del universo.', categorias: [] },
    { nombre: 'Biología', descripcion: 'Competencia sobre los principios fundamentales de la biología, desde células hasta ecosistemas.', categorias: [] },
    { nombre: 'Química', descripcion: 'Olimpiada centrada en principios químicos, reacciones y aplicaciones prácticas.', categorias: [] },
    { nombre: 'Física', descripcion: 'Competencia sobre principios físicos, leyes naturales y sus aplicaciones.', categorias: [] },
    { nombre: 'Informática', descripcion: 'Desafíos de programación, algoritmos y resolución de problemas computacionales.', categorias: [] }
  ]);

  const [mostrarModalArea, setMostrarModalArea] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [areaAEliminar, setAreaAEliminar] = useState(null);
  const [indexAEliminar, setIndexAEliminar] = useState(null);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [areaActual, setAreaActual] = useState(null);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [areaEditandoIndex, setAreaEditandoIndex] = useState(null);
  const [mostrarConfirmacionCategoria, setMostrarConfirmacionCategoria] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [areaDeCategoria, setAreaDeCategoria] = useState(null);
  const [toastMensaje, setToastMensaje] = useState(null);
  const [modalKey, setModalKey] = useState(Date.now());

  const mostrarToast = (mensaje) => {
    setToastMensaje(mensaje);
    setTimeout(() => setToastMensaje(null), 2500);
  };

  const agregarArea = (nuevaArea) => {
    if (areaEditandoIndex !== null) {
      const nuevasAreas = [...areas];
      nuevasAreas[areaEditandoIndex] = {
        ...nuevasAreas[areaEditandoIndex],
        ...nuevaArea
      };
      setAreas(nuevasAreas);
      setAreaEditandoIndex(null);
    } else {
      setAreas([...areas, { ...nuevaArea, categorias: [] }]);
    }
    setMostrarModalArea(false);
  };

  const agregarCategoria = (nuevaCategoria) => {
    const nuevasAreas = areas.map(area => {
      if (area.nombre === nuevaCategoria.area) {
        return {
          ...area,
          categorias: [...(area.categorias || []), nuevaCategoria]
        };
      }
      return area;
    });
    setAreas(nuevasAreas);
  };

  const actualizarCategoria = (categoriaActualizada) => {
    const nuevasAreas = areas.map(area => {
      if (area.nombre === categoriaActualizada.area) {
        const nuevasCategorias = area.categorias.map(cat =>
          cat.nombre === categoriaEditando.nombre ? categoriaActualizada : cat
        );
        return { ...area, categorias: nuevasCategorias };
      }
      return area;
    });
    setAreas(nuevasAreas);
    setCategoriaEditando(null);
  };

  const eliminarCategoria = () => {
    const nuevasAreas = areas.map(area => {
      if (area.nombre === areaDeCategoria) {
        const filtradas = area.categorias.filter(cat => cat.nombre !== categoriaAEliminar);
        return { ...area, categorias: filtradas };
      }
      return area;
    });
    setAreas(nuevasAreas);
    setMostrarConfirmacionCategoria(false);
    mostrarToast(`Categoría "${categoriaAEliminar}" eliminada correctamente`);
  };

  const editarArea = (index) => {
    setAreaActual(areas[index]);
    setAreaEditandoIndex(index);
    setMostrarModalArea(true);
  };

  const preguntarEliminar = (index) => {
    setIndexAEliminar(index);
    setAreaAEliminar(areas[index].nombre);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = () => {
    setAreas(areas.filter((_, i) => i !== indexAEliminar));
    setMostrarConfirmacion(false);
    mostrarToast(`Área "${areaAEliminar}" eliminada correctamente`);
  };

  const cerrarModalCategoria = () => {
    setMostrarModalCategoria(false);
    setCategoriaEditando(null);
    setModalKey(Date.now()); // Reinicia el modal para limpiar campos
  };

  return (
    <div className="contenedor-areas">
      <div className="encabezado">
        <h2>Áreas Científicas</h2>
        <button className="btn-nueva-area" onClick={() => {
          setAreaActual(null);
          setAreaEditandoIndex(null);
          setMostrarModalArea(true);
        }}>
          <FaPlus /> Nueva Área
        </button>
      </div>

      <div className="grid-areas">
        {areas.map((area, index) => (
          <div className="card-area" key={index}>
            <div className="card-header">
              <h3>{area.nombre}</h3>
              <div className="card-actions">
                <button onClick={() => editarArea(index)}><FaEdit /></button>
                <button onClick={() => preguntarEliminar(index)}><FaTrashAlt /></button>
              </div>
            </div>
            <p>{area.descripcion}</p>

            {area.categorias.length > 0 && (
              <div className="categorias-box">
                <h4>Categorías / Niveles</h4>
                {area.categorias.map((cat, i) => (
                  <div key={i} className="categoria-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{cat.nombre}</strong>
                      <div>
                        <button onClick={() => {
                          setCategoriaEditando(cat);
                          setMostrarModalCategoria(true);
                        }}><FaEdit size={14} /></button>
                        <button onClick={() => {
                          setCategoriaAEliminar(cat.nombre);
                          setAreaDeCategoria(area.nombre);
                          setMostrarConfirmacionCategoria(true);
                        }}><FaTrashAlt size={14} /></button>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', margin: 0 }}>{cat.descripcion}</p>
                    <div className="grados">
                      {cat.gradosPrimaria.map((g, idx) => (
                        <span key={idx} className="grado-chip">Primaria {g}</span>
                      ))}
                      {cat.gradosSecundaria.map((g, idx) => (
                        <span key={idx} className="grado-chip">Secundaria {g}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn-categoria"
              onClick={() => {
                setAreaActual(area.nombre);
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

      <ModalNuevaArea
        mostrar={mostrarModalArea}
        cerrar={() => setMostrarModalArea(false)}
        agregarArea={agregarArea}
        areaAEditar={areaActual}
      />

      <ModalConfirmacionEliminar
        mostrar={mostrarConfirmacion}
        cerrar={() => setMostrarConfirmacion(false)}
        confirmar={confirmarEliminacion}
        nombreArea={areaAEliminar}
      />

      <ModalConfirmacionEliminarCategoria
        mostrar={mostrarConfirmacionCategoria}
        cerrar={() => setMostrarConfirmacionCategoria(false)}
        confirmar={eliminarCategoria}
        nombreCategoria={categoriaAEliminar}
      />

      <ModalNuevaCategoria
        key={modalKey}
        mostrar={mostrarModalCategoria}
        cerrar={cerrarModalCategoria}
        areaSeleccionada={areaActual?.nombre || ''}
        areas={areas}
        onCrearCategoria={agregarCategoria}
        onActualizarCategoria={actualizarCategoria}
        categoriaAEditar={categoriaEditando}
      />

      {toastMensaje && (
        <div className="toast-mensaje">
          {toastMensaje}
        </div>
      )}
    </div>
  );
};

export default TablaArea;