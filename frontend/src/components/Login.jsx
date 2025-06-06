import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import {
  validateLogin,
  handleUsuarioInputChange,
} from "../forms/usuarioFormHandler";
import { useAuth } from "../context/authContext";
import axios from "axios";
import logo from "../image/logo.png"; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ correo: "", contraseña: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const rutasPorRolId = {
    1: "/inicio-admin",
    4: "/inicio-tutor",
    2: "/inicio-competidor",
    3: "/inicio-cajero",
  };

  const handleChange = handleUsuarioInputChange(formData, setFormData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validateLogin(formData);
    setErrors(errores);

    if (Object.keys(errores).length === 0) {
      try {
        // Adaptar los datos según lo que espera el backend
        const datosParaEnviar = {
          correo_electronico: formData.correo,
          password: formData.contraseña,
        };

        //console.log("Enviando datos:", JSON.stringify(datosParaEnviar));

        const response = await axios.post(
          "http://localhost:7777/api/login",
          datosParaEnviar,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        //console.log("respuesta:", response);
        const { token, usuario } = response.data;

        login(usuario, token);

        const destino = rutasPorRolId[usuario.rol_id];
        if (destino) {
          navigate(destino);
        } else {
          console.warn("rol:", usuario.rol_id);
          navigate("/"); // fallback
        }
      } catch (error) {
        console.error("Error completo:", error);

        setErrors({
          correo: "Error al iniciar sesion",
          contraseña: "credenciales incorrectas",
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo SanSi" className="login-logo" />
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
          <img
            src="/src/image/email-icon.svg"
            alt="Correo"
            className="icon-input"
          />
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
            src={`/src/image/${
              showPassword ? "ojo-abierto" : "ojo-cerrado"
            }.svg`}
            alt={showPassword ? "Ocultar" : "Mostrar"}
            className="icon-input password-toggle"
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          />
        </div>
        {errors.contraseña && (
          <span className="error-text">{errors.contraseña}</span>
        )}

        <a href="#" className="forgot-password">
          Olvidé mi contraseña
        </a>
        <button type="submit" className="login-btn login-submit">
          Iniciar sesión
        </button>
      </form>

      <p className="login-footer">
        Bienvenido a Oh! SANSI - Plataforma de olimpiadas
      </p>
    </div>
  );
};

export default Login;
