// ModalNuevaCategoria.jsx
import React, { useState, useEffect } from 'react';
import '../styles/ModalNuevaCategoria.css';

const ModalNuevaCategoria = ({
  mostrar,
  cerrar,
  areas,
  areaSeleccionada,
  onCrearCategoria,
  categoriaAEditar,
  onActualizarCategoria,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [gradosPrimaria, setGradosPrimaria] = useState([]);
  const [gradosSecundaria, setGradosSecundaria] = useState([]);
  const [areaSeleccionadaInterna, setAreaSeleccionada] = useState(areaSeleccionada || '');
  const [nombreError, setNombreError] = useState('');

  useEffect(() => {
    if (categoriaAEditar) {
      setNombre(categoriaAEditar.nombre);
      setDescripcion(categoriaAEditar.descripcion);
      setGradosPrimaria(categoriaAEditar.gradosPrimaria || []);
      setGradosSecundaria(categoriaAEditar.gradosSecundaria || []);
      setAreaSeleccionada(categoriaAEditar.area);
    }
  }, [categoriaAEditar]);

  const gradosDisponibles = [
    { tipo: 'Primaria', niveles: ['3°', '4°', '5°', '6°'] },
    { tipo: 'Secundaria', niveles: ['1°', '2°', '3°', '4°', '5°', '6°'] },
  ];

  const toggleGrado = (grado, tipo) => {
    if (tipo === 'Primaria') {
      setGradosPrimaria(gradosPrimaria.includes(grado)
        ? gradosPrimaria.filter(g => g !== grado)
        : [...gradosPrimaria, grado]);
    } else {
      setGradosSecundaria(gradosSecundaria.includes(grado)
        ? gradosSecundaria.filter(g => g !== grado)
        : [...gradosSecundaria, grado]);
    }
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setNombreError('El nombre es obligatorio.');
      return;
    }
    if (descripcion.trim() && (gradosPrimaria.length > 0 || gradosSecundaria.length > 0) && areaSeleccionadaInterna) {
      const nuevaCategoria = {
        nombre,
        descripcion,
        area: areaSeleccionadaInterna,
        gradosPrimaria,
        gradosSecundaria,
      };

      if (categoriaAEditar) {
        onActualizarCategoria(nuevaCategoria);
      } else {
        onCrearCategoria(nuevaCategoria);
      }

      cerrar();
      setNombre('');
      setDescripcion('');
      setGradosPrimaria([]);
      setGradosSecundaria([]);
      setAreaSeleccionada('');
      setNombreError('');
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h3>{categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
        <p>Complete la información para {categoriaAEditar ? 'editar la categoría' : 'crear una categoría'}</p>
        <form onSubmit={enviarFormulario}>
          <label>
            Nombre de la Categoría <span className="obligatorio">*</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s3-6]*$/;
                if (value.length <= 15 && regex.test(value)) {
                  setNombre(value);
                  setNombreError('');
                } else if (value.length > 15) {
                  setNombreError('Máximo 30 caracteres.');
                } else {
                  setNombreError('Solo letras, espacios y números del 3 al 6.');
                }
              }}
              placeholder="Ejemplo: Nivel 3 Básico"
              required
              maxLength={15}
            />
            {nombreError && <span className="error">{nombreError}</span>}
          </label>

          <label>
            Descripción <span className="obligatorio">*</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción de la categoría"
              required
            />
          </label>

          <label>
            Área <span className="obligatorio">*</span>
            <select
              value={areaSeleccionadaInterna}
              onChange={(e) => setAreaSeleccionada(e.target.value)}
              required
            >
              <option value="">Seleccione un área</option>
              {areas.map((area, index) => (
                <option key={index} value={area.nombre}>{area.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            Grados Permitidos <span className="obligatorio">*</span>
          </label>

          {gradosDisponibles.map((grupo, i) => (
            <div key={i}>
              <p><strong>{grupo.tipo}</strong></p>
              <div className="grid-grados">
                {grupo.niveles.map((nivel) => (
                  <div
                    key={nivel}
                    className={`grado ${(grupo.tipo === 'Primaria' ? gradosPrimaria : gradosSecundaria).includes(nivel) ? 'seleccionado' : ''}`}
                    onClick={() => toggleGrado(nivel, grupo.tipo)}
                  >
                    {nivel} grado
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="modal-botones">
            <button type="button" className="btn-cancelar" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="btn-crear">{categoriaAEditar ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaCategoria;
