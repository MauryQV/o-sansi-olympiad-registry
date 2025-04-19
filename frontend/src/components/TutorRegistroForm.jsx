import React, { useState } from "react";
import { useFormValidation } from "../hooks/useFormValidation";
import { validarTutor } from "../utils/validations";
import { registrarTutor } from "../services/tutorService";
import { useNavigate } from "react-router-dom";

// Estilos CSS en línea
const styles = {
  form: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  invalidInput: {
    borderColor: "red",
  },
  successMessage: {
    backgroundColor: "#dff0d8",
    color: "#3c763d",
    padding: "10px",
    borderRadius: "4px",
    textAlign: "center",
    marginBottom: "15px",
  },
  errorMessage: {
    backgroundColor: "#f2dede",
    color: "#a94442",
    padding: "10px",
    borderRadius: "4px",
    textAlign: "center",
    marginBottom: "15px",
  },
  required: {
    color: "red",
    marginLeft: "3px",
  },
};

// Estado inicial del formulario
const INITIAL_STATE = {
  nombre: "",
  apellido: "",
  carnet_identidad: "",
  correo_electronico: "",
  telefono: "",
  password: "",
  confirmPassword: "",
};

const TutorRegistroForm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ success: false, error: null });

  // Función que se ejecuta al enviar el formulario
  const handleFormSubmit = async (values) => {
    try {
      setStatus({ success: false, error: null });

      // Eliminar campos que no se envían al backend
      const { confirmPassword, ...tutorData } = values;

      // Llamar al servicio para registrar el tutor
      await registrarTutor(tutorData);

      // Mostrar mensaje de éxito
      setStatus({
        success: true,
        error: null,
        message: "¡Tutor registrado exitosamente! Redirigiendo...",
      });

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus({
        success: false,
        error: error.message,
      });
    }
  };

  // Utilizar el hook de validación
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation(INITIAL_STATE, validarTutor, handleFormSubmit);

  // Determinar si un campo tiene error
  const hasError = (field) => touched[field] && errors[field];

  return (
    <div style={styles.form}>
      <h2 style={styles.title}>Registro de Tutor</h2>

      {status.success && (
        <div style={styles.successMessage}>{status.message}</div>
      )}

      {status.error && <div style={styles.errorMessage}>{status.error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Nombre<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("nombre") ? styles.invalidInput : {}),
            }}
            placeholder="Ingrese su nombre"
          />
          {hasError("nombre") && (
            <div style={styles.error}>{errors.nombre}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Apellido<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="apellido"
            value={values.apellido}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("apellido") ? styles.invalidInput : {}),
            }}
            placeholder="Ingrese su apellido"
          />
          {hasError("apellido") && (
            <div style={styles.error}>{errors.apellido}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Carnet de Identidad<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="carnet_identidad"
            value={values.carnet_identidad}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("carnet_identidad") ? styles.invalidInput : {}),
            }}
            placeholder="Ejemplo: 1234567"
          />
          {hasError("carnet_identidad") && (
            <div style={styles.error}>{errors.carnet_identidad}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Correo Electrónico<span style={styles.required}>*</span>
          </label>
          <input
            type="email"
            name="correo_electronico"
            value={values.correo_electronico}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("correo_electronico") ? styles.invalidInput : {}),
            }}
            placeholder="ejemplo@correo.com"
          />
          {hasError("correo_electronico") && (
            <div style={styles.error}>{errors.correo_electronico}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={values.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("telefono") ? styles.invalidInput : {}),
            }}
            placeholder="Ejemplo: 70123456"
          />
          {hasError("telefono") && (
            <div style={styles.error}>{errors.telefono}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Contraseña<span style={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("password") ? styles.invalidInput : {}),
            }}
            placeholder="Mínimo 8 caracteres"
          />
          {hasError("password") && (
            <div style={styles.error}>{errors.password}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Confirmar Contraseña<span style={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              ...styles.input,
              ...(hasError("confirmPassword") ? styles.invalidInput : {}),
            }}
            placeholder="Confirme su contraseña"
          />
          {hasError("confirmPassword") && (
            <div style={styles.error}>{errors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" style={styles.button} disabled={status.success}>
          Registrarme como Tutor
        </button>
      </form>
    </div>
  );
};

export default TutorRegistroForm;
