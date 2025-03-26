import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
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
            <button className="nav-button active" onClick={() => handleNavigation("/")}>Inicio</button>
            <button className="nav-button" onClick={() => handleNavigation("/registrar-tutores")}>
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

      <div className="content">
        <h2>Bienvenido a Oh! SanSi!</h2>
        <p>Contenido de la página de inicio...</p>
      </div>
    </div>
  );
};

export default Home;