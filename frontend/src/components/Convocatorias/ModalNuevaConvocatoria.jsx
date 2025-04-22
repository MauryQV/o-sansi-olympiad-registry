// src/components/Convocatorias/ModalNuevaConvocatoria.jsx
import React, { useState } from 'react';
import '../../styles/Convocatorias/ModalNuevaConvocatoria.css';

const ModalNuevaConvocatoria = ({ visible, cerrar, agregar }) => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    estado: 'Borrador',
    descripcion: '',
    inscripcionInicio: '',
    inscripcionFin: '',
    competenciaInicio: '',
    competenciaFin: '',
    areas: [],
  });

  const areasDisponibles = [
    'Matemática', 'Robótica', 'Astronomía y Astrofísica',
    'Biología', 'Química', 'Física', 'Informática'
  ];

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarCheckbox = (area) => {
    const seleccionadas = formulario.areas.includes(area)
      ? formulario.areas.filter(a => a !== area)
      : [...formulario.areas, area];

    setFormulario({ ...formulario, areas: seleccionadas });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    agregar({
      ...formulario,
      areas: formulario.areas.length,
    });
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-convocatoria">
        <h3>Nueva Convocatoria</h3>
        <p>Complete la información para crear una convocatoria</p>

        <form className="modal-form" onSubmit={manejarSubmit}>
          <div className="input-row">
            <div className="form-group">
              <label>Nombre de la Convocatoria *</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Ejemplo: Olimpiadas Científicas"
              />
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select name="estado" value={formulario.estado} onChange={manejarCambio}>
                <option value="Borrador">Borrador</option>
                <option value="En inscripción">En inscripción</option>
                <option value="En competencia">En competencia</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Breve descripción de la convocatoria"
            />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Fecha Inicio Inscripción *</label>
              <input
                type="date"
                name="inscripcionInicio"
                value={formulario.inscripcionInicio}
                onChange={manejarCambio}
              />
            </div>
            <div className="form-group">
              <label>Fecha Fin Inscripción *</label>
              <input
                type="date"
                name="inscripcionFin"
                value={formulario.inscripcionFin}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Fecha Inicio Competencia *</label>
              <input
                type="date"
                name="competenciaInicio"
                value={formulario.competenciaInicio}
                onChange={manejarCambio}
              />
            </div>
            <div className="form-group">
              <label>Fecha Fin Competencia *</label>
              <input
                type="date"
                name="competenciaFin"
                value={formulario.competenciaFin}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Áreas de Competencia *</label>
            <div className="modal-areas">
              {areasDisponibles.map((area) => (
                <label className="checkbox-area" key={area}>
                  <input
                    type="checkbox"
                    checked={formulario.areas.includes(area)}
                    onChange={() => manejarCheckbox(area)}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-botones">
            <button type="button" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="btn-crear">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaConvocatoria;
