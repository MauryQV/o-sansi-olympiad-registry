import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/InscripcionCompetidor/FormularioInscripcion.css";
import { useFormularioInscripcion } from "../../hooks/useFormularioInscripcion";
import TutoresTable from "./TutoresTable";
import { esTextoValido } from "../../forms/formularioInscripcionValidator";
import DebugComponent from "./DebugComponent";

const FormularioInscripcion = () => {
  const { convocatoriaId } = useParams();
  const navigate = useNavigate();

  const {
    area,
    categoria,
    grado,
    nivel,
    tutores,
    nuevoTutor,
    areaTutorSeleccionada,
    errores,
    cargando,
    periodoActivo,
    areasDisponibles,
    categoriasDisponibles,
    gradosDisponibles,
    nivelesDisponibles,
    setArea,
    setCategoria,
    setGrado,
    setNivel,
    setNuevoTutor,
    setAreaTutorSeleccionada,
    agregarTutor,
    eliminarTutor,
    manejarEnvio,
    tutoresEncontrados,
  } = useFormularioInscripcion(parseInt(convocatoriaId));

  if (cargando) {
    return <div className="forminsc-cargando">Cargando información...</div>;
  }

  if (!periodoActivo) {
    return (
      <div className="forminsc-contenedor">
        <div className="forminsc-error-periodo">
          <h2>El periodo de inscripción ha finalizado</h2>
          <p>No es posible realizar inscripciones en este momento.</p>
          <button
            className="forminsc-boton-regresar"
            onClick={() => navigate("/convocatorias")}
          >
            Volver a convocatorias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forminsc-contenedor">
      <h1 className="forminsc-titulo">Inscripción a Olimpiadas Científicas</h1>
      <p className="forminsc-subtitulo">
        Complete el formulario para inscribirse en una competencia
      </p>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">
          Información de la Competencia
        </h2>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Área *</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={errores.area ? "forminsc-input-error" : ""}
            >
              <option value="">Seleccione un área</option>
              {areasDisponibles && areasDisponibles.length > 0 ? (
                areasDisponibles.map((a, i) => (
                  <option key={i} value={a}>
                    {a}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay áreas disponibles
                </option>
              )}
            </select>
            {errores.area && (
              <p className="forminsc-error-texto">Debe seleccionar un área</p>
            )}
            {areasDisponibles && areasDisponibles.length === 0 && (
              <p className="forminsc-error-texto">
                No hay áreas disponibles para esta convocatoria
              </p>
            )}
          </div>

          <div className="forminsc-campo">
            <label>Categoría *</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={!area || categoriasDisponibles.length === 0}
              className={errores.categoria ? "forminsc-input-error" : ""}
            >
              <option value="">Seleccione una categoría</option>
              {categoriasDisponibles && categoriasDisponibles.length > 0 ? (
                categoriasDisponibles.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {!area
                    ? "Seleccione un área primero"
                    : "No hay categorías disponibles"}
                </option>
              )}
            </select>
            {errores.categoria && (
              <p className="forminsc-error-texto">
                Debe seleccionar una categoría
              </p>
            )}
          </div>
        </div>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Grado Académico *</label>
            <select
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              className={errores.grado ? "forminsc-input-error" : ""}
            >
              <option value="">Seleccione su grado</option>
              {gradosDisponibles && gradosDisponibles.length > 0 ? (
                gradosDisponibles.map((g, i) => (
                  <option key={i} value={g}>
                    {g}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay grados disponibles
                </option>
              )}
            </select>
            {errores.grado && (
              <p className="forminsc-error-texto">
                Debe seleccionar su grado académico
              </p>
            )}
          </div>

          <div className="forminsc-campo">
            <label>Nivel Educativo *</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className={errores.nivel ? "forminsc-input-error" : ""}
            >
              <option value="">Seleccione un nivel</option>
              {nivelesDisponibles && nivelesDisponibles.length > 0 ? (
                nivelesDisponibles.map((n, i) => (
                  <option key={i} value={n}>
                    {n}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay niveles disponibles
                </option>
              )}
            </select>
            {errores.nivel && (
              <p className="forminsc-error-texto">
                Debe seleccionar un nivel educativo
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Tutores</h2>
        <p className="forminsc-descripcion">
          Seleccione de uno a tres tutores para validar su inscripción. El tutor
          debe estar previamente registrado en el sistema.
        </p>

        <div className="forminsc-fila-buscador-alineado">
          <div className="forminsc-input-con-icono">
            <label>Nombre del tutor *</label>
            <div className="forminsc-buscador-wrapper">
              <input
                type="text"
                className={`forminsc-input ${
                  errores.tutores ? "forminsc-input-error" : ""
                }`}
                placeholder="Buscar tutor..."
                value={nuevoTutor}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (esTextoValido(valor)) {
                    setNuevoTutor(valor);
                  }
                }}
              />
              <span className="forminsc-icono-lupa">
                <Search size={18} />
              </span>
              {nuevoTutor.length >= 3 && tutoresEncontrados.length > 0 && (
                <ul className="forminsc-lista-sugerencias">
                  {tutoresEncontrados.slice(0, 5).map((tutor, index) => (
                    <li
                      key={index}
                      className="forminsc-sugerencia-item"
                      onClick={() => {
                        setNuevoTutor(tutor.nombre);
                        setAreaTutorSeleccionada(tutor.area);
                      }}
                    >
                      {tutor.nombre} - {tutor.area}
                    </li>
                  ))}
                </ul>
              )}
              {nuevoTutor.length >= 3 && tutoresEncontrados.length === 0 && (
                <ul className="forminsc-lista-sugerencias">
                  <li className="forminsc-sugerencia-item forminsc-sugerencia-no-resultados">
                    No se encontraron tutores
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="forminsc-campo">
            <label>Área del Tutor</label>
            <select
              className="forminsc-select"
              value={areaTutorSeleccionada}
              onChange={(e) => setAreaTutorSeleccionada(e.target.value)}
            >
              <option value="">Seleccione área del tutor</option>
              {areasDisponibles && areasDisponibles.length > 0 ? (
                areasDisponibles.map((a, i) => (
                  <option key={i} value={a}>
                    {a}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay áreas disponibles
                </option>
              )}
            </select>
          </div>

          <button
            className={`forminsc-boton-anadir ${
              tutores.length >= 3 ? "forminsc-boton-deshabilitado" : ""
            }`}
            onClick={agregarTutor}
            disabled={tutores.length >= 3}
          >
            + Añadir
          </button>
        </div>

        {errores.tutores && (
          <p className="forminsc-mensaje forminsc-mensaje-error">
            Debe seleccionar al menos un tutor.
          </p>
        )}

        <TutoresTable tutores={tutores} onDelete={eliminarTutor} />

        <div className="forminsc-contador-tutores">
          <p>
            Tutores seleccionados: {tutores.length} de 3 (mínimo: 1, máximo: 3)
          </p>
        </div>
      </section>

      <div className="forminsc-finalizar-wrapper">
        <button className="forminsc-boton-finalizar" onClick={manejarEnvio}>
          Completar inscripción
        </button>
      </div>

      {/* Componente de depuración */}
      <DebugComponent convocatoriaId={parseInt(convocatoriaId)} />
    </div>
  );
};

export default FormularioInscripcion;
