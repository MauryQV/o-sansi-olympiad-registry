// ModalNuevaCategoria.jsx
import React, { useState, useEffect } from "react";
import "../../styles/ModalNuevaCategoria.css";

const ModalNuevaCategoria = ({
  mostrar,
  cerrar,
  areasDisponibles,
  areaSeleccionada,
  onCrearCategoria,
  categoriaAEditar,
  onActualizarCategoria,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [gradosPrimaria, setGradosPrimaria] = useState([]);
  const [gradosSecundaria, setGradosSecundaria] = useState([]);
  const [areaSeleccionadaInterna, setAreaSeleccionada] = useState(
    areaSeleccionada || ""
  );
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (categoriaAEditar) {
      setNombre(categoriaAEditar.nombre);
      setDescripcion(categoriaAEditar.descripcion);
      setGradosPrimaria(categoriaAEditar.gradosPrimaria || []);
      setGradosSecundaria(categoriaAEditar.gradosSecundaria || []);
      setAreaSeleccionada(categoriaAEditar.area);
    } else if (areaSeleccionada) {
      setAreaSeleccionada(areaSeleccionada);
    }
    setErrores({});
  }, [categoriaAEditar, areaSeleccionada]);

  const gradosDisponibles = [
    { tipo: "Primaria", niveles: ["3°", "4°", "5°", "6°"] },
    { tipo: "Secundaria", niveles: ["1°", "2°", "3°", "4°", "5°", "6°"] },
  ];

  const toggleGrado = (grado, tipo) => {
    if (tipo === "Primaria") {
      if (gradosPrimaria.includes(grado)) {
        setGradosPrimaria(gradosPrimaria.filter((g) => g !== grado));
      } else {
        setGradosPrimaria([...gradosPrimaria, grado]);
      }
    } else {
      if (gradosSecundaria.includes(grado)) {
        setGradosSecundaria(gradosSecundaria.filter((g) => g !== grado));
      } else {
        setGradosSecundaria([...gradosSecundaria, grado]);
      }
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (nombre.length > 30) {
      nuevosErrores.nombre = "Máximo 30 caracteres.";
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria.";
    } else if (descripcion.length > 100) {
      nuevosErrores.descripcion = "Máximo 100 caracteres.";
    }

    if (!areaSeleccionadaInterna) {
      nuevosErrores.area = "Debe seleccionar un área.";
    }

    if (gradosPrimaria.length === 0 && gradosSecundaria.length === 0) {
      nuevosErrores.grados = "Debe seleccionar al menos un grado.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

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
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setGradosPrimaria([]);
    setGradosSecundaria([]);
    setErrores({});
    setAreaSeleccionada(areaSeleccionada || "");
  };

  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h3>{categoriaAEditar ? "Editar Categoría" : "Nueva Categoría"}</h3>
        <p>
          Complete la información para{" "}
          {categoriaAEditar ? "editar la categoría" : "crear una categoría"}
        </p>
        <form onSubmit={enviarFormulario} noValidate>
          <label>
            Nombre de la Categoría <span className="obligatorio">*</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={30}
              className={errores.nombre ? "input-error" : ""}
              placeholder="Ejemplo: Nivel 3 Básico"
              required
            />
            {errores.nombre && (
              <span className="error-text">{errores.nombre}</span>
            )}
          </label>

          <label>
            Descripción <span className="obligatorio">*</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={100}
              className={errores.descripcion ? "input-error" : ""}
              placeholder="Breve descripción de la categoría"
              required
            />
            {errores.descripcion && (
              <span className="error-text">{errores.descripcion}</span>
            )}
          </label>

          <label>
            Área <span className="obligatorio">*</span>
            <select
              value={areaSeleccionadaInterna}
              onChange={(e) => setAreaSeleccionada(e.target.value)}
              className={errores.area ? "input-error" : ""}
              required
            >
              <option value="">Seleccione un área</option>
              {areasDisponibles.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre_area || area.nombre}
                </option>
              ))}
            </select>
            {errores.area && <span className="error-text">{errores.area}</span>}
          </label>

          <label>
            Grados Permitidos <span className="obligatorio">*</span>
          </label>
          {gradosDisponibles.map((grupo, i) => (
            <div key={i}>
              <p>
                <strong>{grupo.tipo}</strong>
              </p>
              <div className="grid-grados">
                {grupo.niveles.map((nivel) => (
                  <div
                    key={nivel}
                    className={`grado ${
                      (grupo.tipo === "Primaria"
                        ? gradosPrimaria
                        : gradosSecundaria
                      ).includes(nivel)
                        ? "seleccionado"
                        : ""
                    }`}
                    onClick={() => toggleGrado(nivel, grupo.tipo)}
                  >
                    {nivel}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {errores.grados && (
            <span className="error-text">{errores.grados}</span>
          )}

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
              {categoriaAEditar ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaCategoria;
