import React, { useState } from 'react';
import "../styles/RegistrarTutores.css"; // Importa los estilos CSS

const RegistrarTutores = () => {
  // Estados para almacenar los valores del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [tutores, setTutores] = useState([]); // Estado para almacenar los tutores registrados

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validaciones de los campos
    if (!nombre.trim() || !apellido.trim()) {
      setError("Los nombres y apellidos no pueden estar vacíos.");
      return;
    }
    if (!telefono.trim() || telefono.length !== 8) {
      setError("El número de teléfono debe tener exactamente 8 dígitos.");
      return;
    }
    if (!correo.trim()) {
      setError("Todos los campos deben estar completos.");
      return;
    }

    // Agregar el nuevo tutor a la lista de tutores
    const nuevoTutor = { nombre, apellido, telefono, correo };
    setTutores([...tutores, nuevoTutor]);

    // Limpiar el formulario después de enviar
    limpiarFormulario();
  };

  // Función para limpiar los campos del formulario
  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setCorreo("");
    setError("");
  };

  // Funciones para manejar cambios en los campos de entrada
  const handleNombreChange = (event) => {
    const value = event.target.value;
    if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(value)) {
      setNombre(value);
      setError("");
    }
  };

  const handleApellidoChange = (event) => {
    const value = event.target.value;
    if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(value)) {
      setApellido(value);
      setError("");
    }
  };

  const handleTelefonoChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,8}$/.test(value)) {
      setTelefono(value);
      setError("");
    }
  };

  const handleCorreoChange = (event) => {
    setCorreo(event.target.value);
    setError("");
  };

  return (
    <div className="page-container">
      {/* Formulario de registro de tutor */}
      <div className="form-wrapper">
        <div className="form-container">
          <h2 className="title">FORMULARIO DE REGISTRO DE TUTOR</h2>
          {error && <p className="error-message">{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>NOMBRES</label>
              <input
                type="text"
                placeholder="Introduzca su nombre o nombres"
                className="input"
                required
                value={nombre}
                onChange={handleNombreChange}
              />
            </div>

            <div className="form-group">
              <label>APELLIDOS</label>
              <input
                type="text"
                placeholder="Introduzca su apellido o apellidos"
                className="input"
                required
                value={apellido}
                onChange={handleApellidoChange}
              />
            </div>

            <div className="form-group">
              <label>TELÉFONO</label>
              <input
                type="text"
                placeholder="Introduzca su número de tutor"
                className="input"
                required
                value={telefono}
                onChange={handleTelefonoChange}
                maxLength="8"
              />
            </div>

            <div className="form-group">
              <label>CORREO</label>
              <input
                type="email"
                placeholder="Introduzca el correo del tutor"
                className="input"
                required
                value={correo}
                onChange={handleCorreoChange}
              />
            </div>

            <div className="buttons">
              <button type="button" className="cancel" onClick={limpiarFormulario}>CANCELAR</button>
              <button type="submit" className="register">REGISTRAR</button>
            </div>
          </form>
        </div>
      </div>

      {/* Lista de tutores registrados *
      <div className="tutores-list">
        <h3>Tutores Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {tutores.map((tutor, index) => (
              <tr key={index}>
                <td>{tutor.nombre}</td>
                <td>{tutor.apellido}</td>
                <td>{tutor.telefono}</td>
                <td>{tutor.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
      */}
    </div>
  );
};

export default RegistrarTutores;
