import React from "react";
import TutorRegistroForm from "../components/TutorRegistroForm";
import { Link } from "react-router-dom";

const TutorRegistroPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>O! SANSI Olympiad Registry</h1>
        <p style={styles.subtitle}>Registro de Tutores</p>
      </div>

      <div style={styles.formContainer}>
        <TutorRegistroForm />
      </div>

      <div style={styles.footer}>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" style={styles.link}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#0066cc",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    fontSize: "18px",
  },
  formContainer: {
    marginBottom: "30px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
  },
  link: {
    color: "#0066cc",
    textDecoration: "none",
  },
};

export default TutorRegistroPage;
