import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

// Importación de imágenes desde src/image
import logo from "../image/logo.png";
import fcyt from "../image/fcyt.svg";
import inicioIcon from "../image/inicio.svg";
import inscripcionesIcon from "../image/inscripciones.svg";
import disciplinasIcon from "../image/disciplinas.svg";
import candadoIcon from "../image/candado.svg";
import adminIcon from "../image/admin.svg";

const Navbar = ({ isAdmin, setIsAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="texto-imagen">
        <img className="imagen-nav" src={logo} alt="Logo UMSS" />
        <div className="titulos">
          <h1 className="text-xl font-bold">UNIVERSIDAD MAYOR DE SAN SIMON</h1>
          <h3 className="titulo-abajo">
            Olimpiadas en Ciencia y Tecnología San Simón - Oh! SanSi!
          </h3>
        </div>
        <img className="imagen-nav" src={fcyt} alt="FCyT" />
      </div>

      {/* Menú de navegación */}
      <div className="link-pagina">
        <ul className={`menu ${isOpen ? "open" : "hidden"}`} id="links">
          {!isAdmin ? (
            // Menú para usuarios normales
            <>
              <li>
                <Link to="/" className="menu-item">
                  <img src={inicioIcon} alt="Inicio" className="icon" />
                  &nbsp;&nbsp;Inicio
                </Link>
              </li>
              <li>
                <Link to="/inscripciones" className="menu-item">
                  <img src={inscripcionesIcon} alt="Inscripciones" className="icon" />
                  &nbsp;&nbsp;Inscripciones
                </Link>
              </li>
              <li>
                <Link to="/disciplinas" className="menu-item">
                  <img src={disciplinasIcon} alt="Disciplinas" className="icon" />
                  &nbsp;&nbsp;Disciplinas
                </Link>
              </li>
              <li className="enlace-admin">
                <Link to="/ingresar" className="menu-item">
                  <img src={candadoIcon} alt="Ingresar" className="icon" />
                  &nbsp;&nbsp;Ingresar
                </Link>
              </li>
            </>
          ) : (
            // Menú para administradores
            <>
              <li>
                <Link to="/" className="menu-item">
                  <img src={inicioIcon} alt="Inicio" className="icon" />
                  &nbsp;&nbsp;Inicio
                </Link>
              </li>
              <li>
                <Link to="/registrar-tutores" className="menu-item">
                  <img src={inscripcionesIcon} alt="Registrar tutores" className="icon" />
                  &nbsp;&nbsp;Registrar tutores
                </Link>
              </li>
              <li>
                <Link to="/registrar-disciplinas" className="menu-item">
                  <img src={inscripcionesIcon} alt="Registrar disciplinas" className="icon" />
                  &nbsp;&nbsp;Registrar disciplinas
                </Link>
              </li>
              <li className="enlace-admin">
                <Link to="/admin" className="menu-item">
                  <img src={adminIcon} alt="Admin" className="icon" />
                  &nbsp;&nbsp;Salir
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
