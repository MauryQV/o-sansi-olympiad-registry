// src/components/Login.jsx
import React from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setRol }) => {
  const navigate = useNavigate();

  const loginAs = (rol) => {
    setRol(rol);
    navigate("/");
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
          <input type="password" placeholder="Contraseña" required />
          <img src="/src/image/ojo-cerrado.svg" alt="Mostrar" className="icon-input" />
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