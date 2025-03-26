import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegación
import "../styles/form.css"; // Importa los estilos CSS

const TutorForm = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Estados para almacenar los valores del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    navigate(path);  // Navegar a la ruta especificada
  };

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

    alert("Formulario enviado correctamente");
    limpiarFormulario(); // Limpia el formulario después del envío
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
      {/* Encabezado con imágenes y título */}
      <header className="header">
        <div className="header-container">
          <img src="/image/logo.png" alt="Left Logo" className="side-logo left-logo" />
          <div className="text-section">
            <h1 className="uni-name">UNIVERSIDAD MAYOR DE SAN SIMÓN</h1>
            <h2 className="event-name">Olimpiadas en Ciencias y Tecnología San Simón - Oh! SanSi!</h2>
          </div>
          <img src="/image/Vector.svg" alt="Right Logo" className="side-logo right-logo" />
        </div>

        {/* Barra de navegación */}
        <nav className="nav-bar">
          <div className="nav-left">
            <button className="nav-button" onClick={() => handleNavigation("/")}>Inicio</button>
            <button className="nav-button active" onClick={() => handleNavigation("/registrar-tutores")}>
              Registrar tutores
            </button>
            <button className="nav-button" onClick={() => handleNavigation("/registrar-disciplinas")}>
              Registrar disciplinas
            </button>
          </div>
          <div className="nav-right">
            <button className="nav-button" onClick={() => handleNavigation("/admin")}>ADMIN</button>
          </div>
        </nav>
      </header>

      {/* Formulario de registro de tutor */}
      <div className="form-wrapper">
        <div className="form-container">
          <h2 className="title">FORMULARIO DE REGISTRO DE TUTOR</h2>
          {error && <p className="error-message">{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>NOMBRES</label>
              <input type="text" placeholder="Introduzca su nombre o nombres" className="input" required value={nombre} onChange={handleNombreChange} />
            </div>

            <div className="form-group">
              <label>APELLIDOS</label>
              <input type="text" placeholder="Introduzca su apellido o apellidos" className="input" required value={apellido} onChange={handleApellidoChange} />
            </div>

            <div className="form-group">
              <label>TELÉFONO</label>
              <input type="text" placeholder="Introduzca su número de tutor" className="input" required value={telefono} onChange={handleTelefonoChange} maxLength="8" />
            </div>

            <div className="form-group">
              <label>CORREO</label>
              <input type="email" placeholder="Introduzca el correo del tutor" className="input" required value={correo} onChange={handleCorreoChange} />
            </div>

            <div className="buttons">
              <button type="button" className="cancel" onClick={limpiarFormulario}>CANCELAR</button>
              <button type="submit" className="register">REGISTRAR</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorForm;
