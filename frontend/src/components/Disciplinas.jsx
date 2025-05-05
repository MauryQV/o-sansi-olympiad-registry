import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Disciplinas.css";

// Imágenes
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

const Disciplinas = () => {
  const navigate = useNavigate();

  const handleNavigation = (ruta) => {
    navigate(ruta);
  };

  return (
    <div className="disciplina-content-wrapper">
      <div className="slogan-section">
        <h2>OLIMPIADAS CIENTÍFICAS ESCOLARES.</h2>
        <p className="slogan-text">
          "¡Despierta el científico que llevas dentro! Participa en nuestras Olimpiadas Científicas y vive la emoción de explorar, descubrir y compartir. ¡El futuro de la ciencia comienza aquí!"
        </p>
      </div>

      <div className="disciplinas-container">
        <h2 className="disciplinas-title">DISCIPLINAS</h2>
        <div className="disciplinas-grid">
          {disciplinas.map((disciplina, index) => (
            <div key={index} className="disciplina-card">
              <img src={disciplina.img} alt={disciplina.nombre} className="disciplina-img" />
              <h3>{disciplina.nombre}</h3>
              <button
                className="ingresar-button"
                onClick={() => handleNavigation(disciplina.ruta)}
              >
                Ingresar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Disciplinas;
