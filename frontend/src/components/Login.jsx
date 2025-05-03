// src/components/Login.jsx
import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { validateLogin, handleUsuarioInputChange} from "../forms/usuarioFormHandler";

const Login = ({ setRol }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = handleUsuarioInputChange(formData, setFormData);
  //simula inicio sesion

  const usuariosSimulados = [
    { correo: "admin@gmail.com", contraseña: "12345678-A", rol: "admin" },
    { correo: "tutor@gmail.com", contraseña: "87654321-T", rol: "tutor" },
    { correo: "competidor@gmail.com", contraseña: "11223344", rol: "competidor" },
    { correo: "cajero@gmail.com", contraseña: "55667788", rol: "cajero" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errores = validateLogin(formData);
    setErrors(errores);

    if (Object.keys(errores).length === 0) {
      const usuario = usuariosSimulados.find(
        (u) =>
          u.correo.toLowerCase() === formData.correo.toLowerCase() &&
          u.contraseña === formData.contraseña
      );

      if (usuario) {
        setRol(usuario.rol);
        const rutasPorRol = {
          admin: "/inicio-admin",
          competidor: "/inicio-competidor",
          tutor: "/inicio-tutor",
          cajero: "/inicio-cajero",
        };
        navigate(rutasPorRol[usuario.rol]);
      } else {
        setErrors({
          correo: "Credenciales incorrectas o usuario no encontrado.",
          contraseña: "Verifique su correo y contraseña.",
        });
      }
    }
  };


    // Redireccionar según el rols
  const loginAs = (rol) => {
    setRol(rol);
  
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
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input 
          type="text" 
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="tu@gmail.com"
          className={errors.correo ? "input-error" : ""}
          />
          <img src="/src/image/email-icon.svg" alt="Correo" className="icon-input" />
        </div>
        {errors.correo && <span className="error-text">{errors.correo}</span>}

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
            className={errors.contraseña ? "input-error" : ""}            
          />
          <img
            src={`/src/image/${showPassword ? "ojo-abierto" : "ojo-cerrado"}.svg`}
            alt={showPassword ? "Ocultar" : "Mostrar"}
            className="icon-input password-toggle"
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          />
        </div>
        {errors.contraseña && <span className="error-text">{errors.contraseña}</span>}

        <a href="#" className="forgot-password">Olvidé mi contraseña</a>
        <button type="submit" className="login-btn login-submit">Iniciar sesión</button>
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