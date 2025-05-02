import React from 'react';
import { Search } from 'lucide-react';
import '../../styles/InscripcionCompetidor/FormularioInscripcion.css';
import { useFormularioInscripcion } from '../../hooks/useFormularioInscripcion';
import TutoresTable from './TutoresTable';
import { esTextoValido } from '../../forms/formularioInscripcionValidator';

const FormularioInscripcion = () => {
  const {
    area, categoria, grado, nivel, tutores, nuevoTutor, areaTutorSeleccionada, errores,
    areasDisponibles, categoriasDisponibles, gradosDisponibles, nivelesDisponibles,
    setArea, setCategoria, setGrado, setNivel, setNuevoTutor, setAreaTutorSeleccionada,
    agregarTutor, eliminarTutor, manejarEnvio, tutoresFiltrados
  } = useFormularioInscripcion();

  return (
    <div className="forminsc-contenedor">
      <h1 className="forminsc-titulo">Inscripción a Olimpiadas Científicas</h1>
      <p className="forminsc-subtitulo">Complete el formulario para inscribirse en una competencia</p>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Información de la Competencia</h2>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Área *</label>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={errores.area ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione un área</option>
              {areasDisponibles.map((a, i) => (
                <option key={i} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="forminsc-campo">
            <label>Categoría *</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={categoriasDisponibles.length === 0} className={errores.categoria ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione una categoría</option>
              {categoriasDisponibles.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Grado *</label>
            <select value={grado} onChange={(e) => setGrado(e.target.value)} className={errores.grado ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione su grado</option>
              {gradosDisponibles.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="forminsc-campo">
            <label>Nivel Educativo *</label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)} className={errores.nivel ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione un nivel</option>
              {nivelesDisponibles.map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Tutores</h2>

        <div className="forminsc-fila-buscador-alineado">
          <div className="forminsc-input-con-icono">
            <input
              type="text"
              className="forminsc-input"
              placeholder="Buscar tutor..."
              value={nuevoTutor}
              onChange={(e) => {
                const valor = e.target.value;
                if (esTextoValido(valor)) {
                  setNuevoTutor(valor);
                }
              }}
            />
            <span className="forminsc-icono-lupa"><Search size={18} /></span>
            {nuevoTutor && tutoresFiltrados.length > 0 && (
              <ul className="forminsc-lista-sugerencias">
                {tutoresFiltrados
                  .filter((t) => t.nombre.toLowerCase().includes(nuevoTutor.toLowerCase()))
                  .slice(0, 5)
                  .map((t, index) => (
                    <li key={index} className="forminsc-sugerencia-item" onClick={() => setNuevoTutor(t.nombre)}>
                      {t.nombre}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <select className="forminsc-select" value={areaTutorSeleccionada} onChange={(e) => setAreaTutorSeleccionada(e.target.value)}>
            <option value="">Área del Tutor</option>
            {areasDisponibles.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
          </select>
          <button className="forminsc-boton-anadir" onClick={agregarTutor}>+ Añadir</button>
        </div>

        {errores.tutores && (
          <p className="forminsc-mensaje forminsc-mensaje-error">
            Debe seleccionar al menos un tutor.
          </p>
        )}

        <TutoresTable tutores={tutores} onDelete={eliminarTutor} />
      </section>

      <div className="forminsc-finalizar-wrapper">
        <button className="forminsc-boton-finalizar" onClick={manejarEnvio}>
          Completar inscripción
        </button>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
