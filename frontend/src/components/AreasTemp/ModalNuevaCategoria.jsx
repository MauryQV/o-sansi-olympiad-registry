import React, { useState, useEffect } from 'react';
import '../../styles/Areas/ModalNuevaCategoria.css';
import useCategoriaForm from '../../hooks/useCategoriaForm';
import GradosSelector from './gradosComponent';
import { obtenerCategorias } from '../../services/categoriaService';

/**
 * Modal para crear o editar una categoría
 */
const ModalNuevaCategoria = ({
  mostrar,
  cerrar,
  areas,
  areaSeleccionada,
  onCrearCategoria,
  categoriaAEditar,
  onActualizarCategoria,
  todasLasRelaciones = [],
}) => {
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      if (mostrar) {
        try {
          const data = await obtenerCategorias();
          setTodasLasCategorias(data || []);
        } catch (error) {
          console.error("Error al cargar todas las categorías:", error);
          setTodasLasCategorias([]);
        }
      }
    };
    cargarCategorias();
  }, [mostrar]);

  const {
    nombre,
    setNombre,
    descripcion,
    setDescripcion,
    areaSeleccionadaInterna,
    setAreaSeleccionada,
    grados,
    gradosSeleccionados,
    errores,
    toggleGrado,
    enviarFormulario,
    limpiarFormulario
  } = useCategoriaForm(
    categoriaAEditar,
    areaSeleccionada,
    onCrearCategoria,
    onActualizarCategoria,
    cerrar,
    todasLasCategorias,
    todasLasRelaciones
  );

  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h3>{categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
        <p>Complete la información para {categoriaAEditar ? 'editar la categoría' : 'crear una categoría'}</p>
        <form onSubmit={enviarFormulario} noValidate>
          
          <label>
            Nombre de la Categoría <span className="obligatorio">*</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={30}
              className={errores.nombre ? 'input-error' : ''}
              placeholder="Ejemplo: Nivel 3 Básico"
              required
            />
            {errores.nombre && <span className="error-text">{errores.nombre}</span>}
          </label>

          <label>
            Descripción <span className="obligatorio">*</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={100}
              className={errores.descripcion ? 'input-error' : ''}
              placeholder="Breve descripción de la categoría"
              required
            />
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </label>

          <label>
            Área <span className="obligatorio">*</span>
            <select
              value={areaSeleccionadaInterna}
              onChange={(e) => setAreaSeleccionada(e.target.value)}
              className={errores.area ? 'input-error' : ''}
              required
            >
              <option value="">Seleccione un área</option>
              {areas.map((area, index) => (
                <option key={area.id || index} value={area.id}>
                  {area.nombre_area}
                </option>
              ))}
            </select>
            {errores.area && <span className="error-text">{errores.area}</span>}
          </label>

          <GradosSelector
            grados={grados}
            gradosSeleccionados={gradosSeleccionados}
            toggleGrado={toggleGrado}
            error={errores.grados}
          />

          <div className="modal-botones">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={() => { 
                cerrar(); 
                limpiarFormulario(); 
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-crear">
              {categoriaAEditar ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaCategoria;