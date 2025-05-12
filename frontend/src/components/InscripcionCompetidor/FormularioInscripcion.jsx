import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/InscripcionCompetidor/FormularioInscripcion.css';
import { useFormularioInscripcion } from '../../hooks/useFormularioInscripcion';
import TutoresTable from './TutoresTable';
import ModalTutores from './ModalTutores';


const FormularioInscripcion = () => {
  const {
    area, 
    categoria, 
    grado, 
    nivel, 
    tutores,
    nuevoTutor, 
    errores,
    areasDisponibles,
    categoriasDisponibles, 
    gradosDisponibles, 
    nivelesDisponibles,
    setArea, setCategoria, setGrado, setNivel,
    agregarTutor, eliminarTutor, manejarEnvio, 
  } = useFormularioInscripcion();

  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="forminsc-contenedor">
      <h1 className="forminsc-titulo">Inscripción a Olimpiadas Científicas</h1>
      <p className="forminsc-subtitulo">Complete el formulario para inscribirse en una competencia</p>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Información de la Competencia</h2>
        <p className="forminsc-descripcion">Seleccione el área y la categoría en la que desea participar</p>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Área *</label>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={errores.area ? 'forminsc-input-error' : ''}>
        <option value="">Seleccione un área</option>
     {areasDisponibles.map((a) => (
     <option key={a.id} value={a.id}>{a.nombre_area}</option>
      ))}
        </select>
          </div>

          <div className="forminsc-campo">
            <label>Categoría *</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={categoriasDisponibles.length === 0} className={errores.categoria ? 'forminsc-input-error' : ''}>
            <option value="">Seleccione una categoría</option>
             {categoriasDisponibles.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
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
        <p className="forminsc-descripcion">Seleccione de uno a tres tutores para su participación</p>

        <div className="forminsc-fila-buscador-alineado">
          <div className="forminsc-input-con-icono">
            <input
              type="text"
              className="forminsc-input"
              placeholder="Buscar tutor..."
              value={nuevoTutor}
              readOnly
              onClick={() => setMostrarModal(true)}
            />
            <span className="forminsc-icono-lupa"><Search size={18} /></span>
          </div>

          <button className="forminsc-boton-anadir" onClick={agregarTutor}>+ Añadir</button>
        </div>

        {errores.tutores && (
          <p className="forminsc-mensaje forminsc-mensaje-error">
            No hay tutores seleccionados. Añada al menos uno para continuar.
          </p>
        )}

        <TutoresTable tutores={tutores} onDelete={eliminarTutor} />

        {mostrarModal && (
  <ModalTutores
    areaSeleccionada={area}
    onClose={() => setMostrarModal(false)}
    onSelect={agregarTutor} // ← usa directamente la función del hook
  />
)}
      </section>

      <div className="forminsc-finalizar-wrapper alineado-derecha">
        <button className="forminsc-boton-finalizar" onClick={manejarEnvio}>
          Completar inscripción
        </button>
      </div>
    </div>
  );
};

export default FormularioInscripcion;