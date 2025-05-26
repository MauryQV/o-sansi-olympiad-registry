import React from 'react';
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
    mostrarModal,
    areasDisponibles,
    categoriasDisponibles, 
    gradosFiltrados, 
    nivelesDisponibles,
    cargandoGrados,
    cargandoCategorias,
    tutoresDisponibles,
    busqueda,
    resultados,
    setArea, 
    setCategoria, 
    setGrado, 
    setNivel,
    setMostrarModal,
    setBusqueda,
    setNuevoTutor,
    buscarTutores,
    agregarTutor, 
    eliminarTutor, 
    manejarEnvio,
    tutoresFiltrados
  } = useFormularioInscripcion();

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
            <select 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              className={errores.area ? 'forminsc-input-error' : ''}
            >
              <option value="">Seleccione un área</option>
              {areasDisponibles.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre_area}</option>
              ))}
            </select>
            {errores.area && <span className="forminsc-texto-error">Este campo es obligatorio</span>}
          </div>

          <div className="forminsc-campo">
            <label>Categoría *</label>
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)} 
              disabled={!area || categoriasDisponibles.length === 0 || cargandoCategorias} 
              className={errores.categoria ? 'forminsc-input-error' : ''}
            >
              <option value="">
                {cargandoCategorias 
                  ? 'Cargando categorías...' 
                  : categoriasDisponibles.length === 0 
                    ? 'Seleccione primero un área'
                    : 'Seleccione una categoría'
                }
              </option>
              {categoriasDisponibles.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errores.categoria && <span className="forminsc-texto-error">Este campo es obligatorio</span>}
          </div>
        </div>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Nivel Educativo</label>
            <select 
              value={nivel} 
              onChange={(e) => setNivel(e.target.value)} 
              className={errores.nivel ? 'forminsc-input-error' : ''}
              disabled={nivelesDisponibles.length === 0}
            >
              <option value="">Seleccione un nivel</option>
              {nivelesDisponibles.map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </select>
            {errores.nivel && <span className="forminsc-texto-error">Este campo es obligatorio</span>}
          </div>

          <div className="forminsc-campo">
            <label>Grado</label>
            <select 
              value={grado} 
              onChange={(e) => setGrado(e.target.value)} 
              className={errores.grado ? 'forminsc-input-error' : ''}
              disabled={!nivel || gradosFiltrados.length === 0 || cargandoGrados}
            >
              <option value="">
                {cargandoGrados 
                  ? 'Cargando grados...' 
                  : !nivel 
                    ? 'Seleccione primero un nivel' 
                    : gradosFiltrados.length === 0 
                      ? 'No hay grados disponibles' 
                      : 'Seleccione su grado'
                }
              </option>
              {gradosFiltrados.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre_grado}°
                </option>
              ))}
            </select>
            {errores.grado && <span className="forminsc-texto-error">Este campo es obligatorio</span>}
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

          <button className="forminsc-boton-anadir" onClick={() => setMostrarModal(true)}>+ Añadir</button>
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
            onSelect={agregarTutor}
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