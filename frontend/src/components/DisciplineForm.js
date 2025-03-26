import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import "../styles/disciplina.css";

// Importar imágenes correctas
import astronomiaImg from "../image/astronomia.jpg";
import quimicaImg from "../image/quimica.jpg";
import fisicaImg from "../image/fisica.webp";
import informaticaImg from "../image/informatica.jpg";
import matematicaImg from "../image/matematicas7.jpg";
import biologiaImg from "../image/biologia.jpg";
import roboticaImg from "../image/robotica.jpg";

const disciplinas = [
  { nombre: "Astronomía y Astrofísica", img: astronomiaImg, ruta: "/astronomia" },
  { nombre: "Química", img: quimicaImg, ruta: "/quimica" },
  { nombre: "Física", img: fisicaImg, ruta: "/fisica" },
  { nombre: "Informática", img: informaticaImg, ruta: "/informatica" },
  { nombre: "Matemática", img: matematicaImg, ruta: "/matematica" },
  { nombre: "Biología", img: biologiaImg, ruta: "/biologia" },
  { nombre: "Robótica", img: roboticaImg, ruta: "/robotica" },
];

const DisciplinasPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (ruta) => {
    navigate(ruta);
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="header-container">
          <img src="/image/logo.png" alt="Left Logo" className="side-logo left-logo" />
          <div className="text-section">
            <h1 className="uni-name">UNIVERSIDAD MAYOR DE SAN SIMÓN</h1>
            <h2 className="event-name">Olimpiadas en Ciencias y Tecnología San Simón - Oh! SanSi!</h2>
          </div>
          <img src="/image/Vector.svg" alt="Right Logo" className="side-logo right-logo" />
        </div>

        <nav className="nav-bar">
          <div className="nav-left">
            <button className="nav-button" onClick={() => handleNavigation("/")}>Inicio</button>
            <button className="nav-button" onClick={() => handleNavigation("/registrar-tutores")}>Registrar tutores</button>
            <button className="nav-button active" onClick={() => handleNavigation("/disciplinas")}>Disciplinas</button>
          </div>
          <div className="nav-right">
            <button className="nav-button" onClick={() => handleNavigation("/admin")}>ADMIN</button>
          </div>
        </nav>
      </header>

      <div className="disciplinas-container">
        <div className="slogan-section">
          <h1>OLIMPIADAS CIENTÍFICAS ESCOLARES</h1>
          <p className="slogan-text">
            "¡Despierta el científico que llevas dentro! Participa en nuestras Olimpiadas Científicas y vive la emoción de explorar, descubrir y compartir. ¡El futuro de la ciencia comienza aquí!"
          </p>
        </div>

        <h2 className="disciplinas-title">DISCIPLINAS</h2>
        <div className="disciplinas-grid">
          {disciplinas.map((disciplina, index) => (
            <div key={index} className="disciplina-card">
              <img src={disciplina.img} alt={disciplina.nombre} className="disciplina-img" />
              <h3>{disciplina.nombre}</h3>
              <button className="ingresar-button" onClick={() => handleNavigation(disciplina.ruta)}>Ingresar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisciplinasPage;
