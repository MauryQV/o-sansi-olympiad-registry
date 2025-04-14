import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/FormularioInscripcion.css';

const FormularioInscripcion = () => {
  const [area, setArea] = useState('');
  const [grado, setGrado] = useState('');
  const [nivel, setNivel] = useState('');
  const [tutores, setTutores] = useState([]);
  const [nuevoTutor, setNuevoTutor] = useState('');
  const [relacion, setRelacion] = useState('');
  const [errores, setErrores] = useState({});

  const agregarTutor = () => {
    if (nuevoTutor && relacion && tutores.length < 3) {
      const nuevo = {
        nombre: nuevoTutor,
        correo: 'ana.martinez@mail.com', // Simulado
        telefono: '70123456',            // Simulado
        relacion: relacion,
      };
      setTutores([...tutores, nuevo]);
      setNuevoTutor('');
      setRelacion('');
    }
  };

  const eliminarTutor = (index) => {
    const nuevos = [...tutores];
    nuevos.splice(index, 1);
    setTutores(nuevos);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!area) nuevosErrores.area = true;
    if (!grado) nuevosErrores.grado = true;
    if (!nivel) nuevosErrores.nivel = true;
    if (tutores.length === 0) nuevosErrores.tutores = true;
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = () => {
    if (validarFormulario()) {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu inscripción ha sido registrada correctamente.',
        confirmButtonColor: '#3085d6',
      });
      setArea('');
      setGrado('');
      setNivel('');
      setTutores([]);
      setErrores({});
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Faltan campos obligatorios',
        text: 'Por favor, complete todos los campos marcados con *.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="forminsc-contenedor">
      <h1 className="forminsc-titulo">Inscripción a Olimpiadas Científicas</h1>
      <p className="forminsc-subtitulo">Complete el formulario para inscribirse en una competencia</p>

      {/* Información de la competencia */}
      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Información de la Competencia</h2>
        <p className="forminsc-descripcion">Seleccione el área y categoría en la que desea participar</p>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Área <span className="forminsc-requerido">*</span></label>
            <select
              className={errores.area ? 'forminsc-input-error' : ''}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">Seleccione un área</option>
              <option value="matematica">Matemática</option>
              <option value="quimica">Química</option>
            </select>
          </div>
          <div className="forminsc-campo">
            <label>Categoría <span className="forminsc-requerido">*</span></label>
            <select disabled>
              <option value="">Primero seleccione un área</option>
            </select>
          </div>
        </div>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Grado <span className="forminsc-requerido">*</span></label>
            <select
              className={errores.grado ? 'forminsc-input-error' : ''}
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
            >
              <option value="">Seleccione su grado actual</option>
              <option value="5">5°</option>
              <option value="6">6°</option>
            </select>
          </div>
          <div className="forminsc-campo">
            <label>Nivel Educativo <span className="forminsc-requerido">*</span></label>
            <select
              className={errores.nivel ? 'forminsc-input-error' : ''}
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            >
              <option value="">Seleccione su nivel educativo</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tutores */}
      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Tutores</h2>
        <p className="forminsc-descripcion">Seleccione de uno a tres tutores para su inscripción</p>

        <div className="forminsc-fila-buscador-alineado">
          <div className="forminsc-input-con-icono">
            <input
              className="forminsc-input"
              type="text"
              placeholder="Buscar tutor por nombre..."
              value={nuevoTutor}
              onChange={(e) => setNuevoTutor(e.target.value)}
            />
            <span className="forminsc-icono-lupa">🔍</span>
          </div>
          <select
            className="forminsc-select"
            value={relacion}
            onChange={(e) => setRelacion(e.target.value)}
          >
            <option value="">Relación</option>
            <option value="padre">Madre/Padre</option>
            <option value="tutor">Tutor</option>
            <option value="profesor">Profesor/a</option>
          </select>
          <button className="forminsc-boton-anadir" onClick={agregarTutor}>+ Añadir</button>
        </div>

        {errores.tutores && (
          <p className="forminsc-mensaje forminsc-mensaje-error">
            Debe seleccionar al menos un tutor.
          </p>
        )}

        {tutores.length > 0 && (
          <table className="forminsc-tabla-tutores">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Teléfono</th>
                <th>Relación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tutores.map((tutor, index) => (
                <tr key={index}>
                  <td>{tutor.nombre}</td>
                  <td>{tutor.correo}</td>
                  <td>{tutor.telefono}</td>
                  <td>{tutor.relacion}</td>
                  <td>
                    <button
                      className="forminsc-btn-eliminar-tutor"
                      onClick={() => eliminarTutor(index)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="forminsc-mensaje">
          Puede seleccionar hasta 3 tutores. {3 - tutores.length} disponibles
        </p>
      </section>

      {/* Botón Final */}
      <div className="forminsc-finalizar-wrapper">
        <button className="forminsc-boton-finalizar" onClick={manejarEnvio}>
          Completar inscripción
        </button>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
