import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import ModalNuevaArea from './ModalNuevaArea';
import ModalConfirmacionEliminar from './ModalConfirmacionEliminar';
import ModalConfirmacionEliminarCategoria from './ModalConfirmacionEliminarCategoria';
import ModalNuevaCategoria from './ModalNuevaCategoria';
import '../../styles/Areas/TablaArea.css';
import { eliminarArea, getAreas, getCategorias, getCategoriasAreas, getGrados } from '../../services/areaService';
import { crearCategoria, actualizarCategoria as actualizarCategoriaAPI, eliminarCategoriaYRelaciones } from '../../services/categoriaService';
import axios from 'axios';

const TablaArea = () => {
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [relaciones, setRelaciones] = useState([]);
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
  const [grados, setGrados] = useState([]);
  const [areaParaCategoria, setAreaParaCategoria] = useState(null);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState(null);
  const [categoriaIdAEliminar, setCategoriaIdAEliminar] = useState(null);

  useEffect(() => {
    const response = async () => {
      try {
        const dataAreas = await getAreas();
        setAreas(dataAreas || []);

        const dataCategorias = await getCategorias();
        setCategorias(dataCategorias || []);

        const dataRelaciones = await getCategoriasAreas();
        setRelaciones(dataRelaciones || []);

        const dataGrados = await getGrados();
        setGrados(dataGrados || []);

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setAreas([]);
        setCategorias([]);
        setRelaciones([]);
        setGrados([]);
      }
    };
    response();
  }, []);

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

  const agregarCategoria = async (nuevaCategoria) => {
    console.log('Valor recibido de área:', nuevaCategoria.area);
    console.log('Áreas disponibles:', areas.map(a => a.nombre));
    const areaSeleccionada = areas.find(area => String(area.id) === String(nuevaCategoria.area));
    if (!areaSeleccionada) {
      mostrarToast('❌ Área no encontrada');
      setMostrarModalCategoria(false);
      return;
    }
    const gradosTodos = [...(nuevaCategoria.gradosPrimaria || []), ...(nuevaCategoria.gradosSecundaria || [])];
    if (!gradosTodos.length) {
      mostrarToast('❌ Debe seleccionar al menos un grado');
      setMostrarModalCategoria(false);
      return;
    }
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      mostrarToast('❌ Complete todos los campos requeridos');
      setMostrarModalCategoria(false);
      return;
    }
    try {
      const categoriaConAreaId = { ...nuevaCategoria, areaId: areaSeleccionada.id };
      const categoriaCreada = await crearCategoria(categoriaConAreaId);
      const nuevasAreas = areas.map(area => {
        if (area.id === areaSeleccionada.id) {
          return {
            ...area,
            categorias: [...(area.categorias || []), categoriaCreada]
          };
        }
        return area;
      });
      setAreas(nuevasAreas);
      mostrarToast(`Categoría "${categoriaCreada.nombre}" creada correctamente`);
      setMostrarModalCategoria(false);
      window.location.reload();
    } catch (error) {
      mostrarToast('❌ Error al crear la categoría. Verifique los datos.');
      setMostrarModalCategoria(false);
    }
  };

  const actualizarCategoria = async (categoriaActualizada) => {
    try {
      if (!categoriaParaEditar || !categoriaParaEditar.id) {
        mostrarToast('❌ Error: No se puede actualizar la categoría. ID no disponible.');
        return;
      }

      const categoriaActualizadaAPI = await actualizarCategoriaAPI(categoriaParaEditar.id, categoriaActualizada);
      
      // Actualizar el estado local
      const nuevasAreas = areas.map(area => {
        const categoriaEnArea = relaciones.find(rel => 
          rel.categoria_id === categoriaParaEditar.id && 
          rel.area_id === area.id
        );

        if (categoriaEnArea) {
          const nuevasCategorias = categorias.map(cat =>
            cat.id === categoriaParaEditar.id ? categoriaActualizadaAPI : cat
          );
          return { ...area, categorias: nuevasCategorias };
        }
        return area;
      });
      
      const nuevasCategorias = categorias.map(cat =>
        cat.id === categoriaParaEditar.id ? categoriaActualizadaAPI : cat
      );
      
      setAreas(nuevasAreas);
      setCategorias(nuevasCategorias);
      setCategoriaEditando(null);
      setCategoriaParaEditar(null);
      setMostrarModalCategoria(false);
      mostrarToast('✅ Categoría actualizada correctamente');
      
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      mostrarToast('❌ Error al actualizar la categoría. Verifique los datos.');
    }
  };

  const handleConfirmarEliminarCategoria = async () => {
    if (!categoriaIdAEliminar) {
      mostrarToast('❌ Error: ID de categoría no disponible.');
      setMostrarConfirmacionCategoria(false);
      return;
    }
    try {
      await eliminarCategoriaYRelaciones(categoriaIdAEliminar);
      
      setCategorias(prevCategorias => prevCategorias.filter(cat => cat.id !== categoriaIdAEliminar));
      setRelaciones(prevRelaciones => prevRelaciones.filter(rel => rel.categoria_id !== categoriaIdAEliminar));
      
      mostrarToast(`Categoría "${categoriaAEliminar}" eliminada correctamente`);
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      mostrarToast(error.message || '❌ Error al eliminar la categoría.');
    } finally {
      setMostrarConfirmacionCategoria(false);
      setCategoriaIdAEliminar(null);
      setAreaDeCategoria(null);
    }
  };

  const editarArea = (index) => {
    setAreaActual(areas[index]);
    setAreaEditandoIndex(index);
    setMostrarModalArea(true);
  };

  const preguntarEliminar = (index) => {
    const area = areas[index];
    setIndexAEliminar(index);
    setAreaAEliminar(area); 
    setMostrarConfirmacion(true);
  };
  
  
  const confirmarEliminacion = async () => {
    try {
      await eliminarArea(areaAEliminar.id); 
      setAreas(prev => prev.filter((_, i) => i !== indexAEliminar)); 
      setMostrarConfirmacion(false);
      mostrarToast(`Área "${areaAEliminar.nombre_area}" eliminada correctamente`);
    } catch (error) {
      console.error('Error eliminando área:', error.response?.data || error.message);
      mostrarToast('❌ Error al eliminar el área. Intenta nuevamente.');
    }
  };

  const cerrarModalCategoria = () => {
    setMostrarModalCategoria(false);
    setCategoriaEditando(null);
    setModalKey(Date.now());
  };

  const abrirModalNuevaCategoria = (areaIdPreseleccionada = null, categoria = null) => {
    setAreaParaCategoria(areaIdPreseleccionada);
    setCategoriaParaEditar(categoria);
    setCategoriaEditando(categoria);
    setMostrarModalCategoria(true);
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
        {areas.map((area, index) => {
          const categoriasDeEstaArea = relaciones
            .filter(rel => rel.area_id === area.id)
            .map(rel => categorias.find(cat => cat.id === rel.categoria_id))
            .filter(Boolean);

          return (
            <div className="card-area" key={area.id}>
              <div className="card-header">
                <h3>{area.nombre_area}</h3>
                <div className="card-actions">
                  <button onClick={() => editarArea(index)}><FaEdit /></button>
                  <button onClick={() => preguntarEliminar(index)}><FaTrashAlt style={{ color: 'red' }}  /></button>
                </div>
              </div>

              <p className="area-costo">Costo: <strong>{area.costo} Bs</strong></p>

              <p>{area.descripcion_area}</p>

              {categoriasDeEstaArea.length === 0 ? (
                <p>No hay categorías asociadas.</p>
              ) : (
                <div className="categorias-box">
                  <h4>Categorías / Niveles</h4>
                  {categoriasDeEstaArea.map((cat, i) => (
                    <div key={i} className="categoria-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{cat.nombre_categoria}</strong>
                        <div>
                          <button onClick={() => {
                            setCategoriaParaEditar(cat);
                            setAreaParaCategoria(area.id);
                            setCategoriaEditando(cat);
                            setMostrarModalCategoria(true);
                          }}><FaEdit size={14} /></button>
                          <button onClick={() => {
                            setCategoriaAEliminar(cat.nombre_categoria);
                            setCategoriaIdAEliminar(cat.id);
                            setAreaDeCategoria(area.nombre_area);
                            setMostrarConfirmacionCategoria(true);
                          }}><FaTrashAlt size={14} /></button>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', margin: 0 }}>{cat.descripcion_cat}</p>
                      <div className="grados">
                        {grados
                          .filter(g => g.id >= cat.grado_min_id && g.id <= cat.grado_max_id)
                          .map(g => (
                            <span key={g.id} className="grado-chip">
                              {g.nombre_grado}º {(g.nivel?.nombre_nivel || g.nombre_nivel).toLowerCase()}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn-categoria"
                onClick={() => abrirModalNuevaCategoria(area.id)}
              >
                <FaPlus /> Añadir Categoría
              </button>
            </div>
          );
        })}
      </div>

      <ModalNuevaArea
        mostrar={mostrarModalArea}
        cerrar={() => setMostrarModalArea(false)}
        onCreacionExitosa={(areaActualizada) => {
          if (areaEditandoIndex !== null) {
            const nuevasAreas = [...areas];
            nuevasAreas[areaEditandoIndex] = {
              ...nuevasAreas[areaEditandoIndex],
              ...areaActualizada
            };
            setAreas(nuevasAreas);
            setAreaEditandoIndex(null);
            setAreaActual(null);
            setMostrarModalArea(false);
            mostrarToast('Área actualizada correctamente');
          } else {
            setAreaEditandoIndex(null);
            setAreaActual(null);
            setMostrarModalArea(false);
            window.location.reload();
          }
        }}
        areaAEditar={areaActual}
      />

      <ModalConfirmacionEliminar
        mostrar={mostrarConfirmacion}
        cerrar={() => setMostrarConfirmacion(false)}
        confirmar={confirmarEliminacion}
        nombreArea={areaAEliminar?.nombre_area}
      />

      <ModalConfirmacionEliminarCategoria
        mostrar={mostrarConfirmacionCategoria}
        cerrar={() => setMostrarConfirmacionCategoria(false)}
        confirmar={handleConfirmarEliminarCategoria}
        nombreCategoria={categoriaAEliminar}
      />

      <ModalNuevaCategoria
        key={modalKey}
        mostrar={mostrarModalCategoria}
        cerrar={cerrarModalCategoria}
        areas={areas}
        grados={grados}
        areaSeleccionada={areaParaCategoria}
        categoriaAEditar={categoriaParaEditar}
        onCrearCategoria={agregarCategoria}
        onActualizarCategoria={actualizarCategoria}
        todasLasRelaciones={relaciones}
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