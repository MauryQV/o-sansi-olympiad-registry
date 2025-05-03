// src/components/Login.jsx
import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setRol }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const loginAs = (rol) => {
    setRol(rol);
  
    // Redireccionar según el rols
    const rutasPorRol = {
      admin: "/inicio-admin",
      competidor: "/inicio-competidor",
      tutor: "/inicio-tutor",
      cajero: "/inicio-cajero",
    };
  
    navigate(rutasPorRol[rol] || "/"); // Si no hay rol, va al general pa
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <img src="/src/image/logo.png" alt="Logo SanSi" className="login-logo" />
      <h2 className="login-titulo">¡Bienvenido!</h2>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <input type="email" placeholder="tu@gmail.com" required />
          <img src="/src/image/email-icon.svg" alt="Correo" className="icon-input" />
        </div>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            required
          />
          <img
            src={`/src/image/${showPassword ? "ojo-abierto" : "ojo-cerrado"}.svg`}
            alt={showPassword ? "Ocultar" : "Mostrar"}
            className="icon-input password-toggle"
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          />
        </div>

        <a href="#" className="forgot-password">Olvidé mi contraseña</a>
      </form>

      <div className="login-button-group">
        <button className="login-btn" onClick={() => loginAs("admin")}>Administrador</button>
        <button className="login-btn" onClick={() => loginAs("competidor")}>Competidor</button>
        <button className="login-btn" onClick={() => loginAs("cajero")}>Cajero</button>
        <button className="login-btn" onClick={() => loginAs("tutor")}>Tutor</button>
      </div>

      <p className="login-footer">Bienvenido a Oh! SANSI - Plataforma de olimpiadas</p>
    </div>
  );
};

export default Login;