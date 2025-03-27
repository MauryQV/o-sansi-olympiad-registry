import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import '../styles/Navbar.css'

const Navbar = ({ isAdmin, setIsAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">
      
      
        <div className="texto-imagen">
          <img className="imagen-nav" src="/src/image/logo.png"></img>
          <div className="titulos">
            <h1 className="text-xl font-bold">UNIVERSIDAD MAYOR DE SAN SIMON</h1>
            <h3 className="titulo-abajo">Olimpiadas en Ciencia y Tecnología San Simón - Oh! SanSi!</h3>
          </div>
          <img className="imagen-nav" src="/src/image/fcyt.svg"></img>
        </div>
        {/*}
        {/* Menú para móviles 
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
       */}

        {/* Menú de navegación */}
        <div className="link-pagina">
          <ul className={`menu ${isOpen ? "open" : "hidden"}`} id="links">
            {!isAdmin ? (  // Si no es admin, mostramos el menú normal
            <>
              <li>
                <Link to="/" className="menu-item">
                  <img src="/src/image/inicio.svg" alt="Inicio" className="icon" />
                  &nbsp;&nbsp;Inicio
                </Link>
              </li>
              <li>
                <Link to="/inscripciones" className="menu-item">
                <img src="/src/image/inscripciones.svg" alt="Inscripciones" className="icon" />
                &nbsp;&nbsp;Inscripciones
                </Link>
              </li>
              <li>
                <Link to="/disciplinas" className="menu-item">
                <img src="/src/image/disciplinas.svg" alt="Disciplinas" className="icon" />
                &nbsp;&nbsp;Disciplinas
                </Link>
              </li>
              <li className="enlace-admin">
                  <Link to="/ingresar" className="menu-item">
                  <img src="/src/image/candado.svg" alt="Ingresar" className="icon" />
                  &nbsp;&nbsp;Ingresar
                  </Link>
              </li>
            </>
            ):( // Si es admin, mostramos el menú para administradores
              <>
                <li>
                  <Link to="/" className="menu-item">
                    <img src="/src/image/inicio.svg" alt="Inicio" className="icon" />
                    &nbsp;&nbsp;Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/registrar-tutores" className="menu-item">
                  <img src="/src/image/inscripciones.svg" alt="registrar tutores" className="icon" />
                  &nbsp;&nbsp;registrar tutores
                  </Link>
                </li>
                <li>
                  <Link to="/registrar-disciplinas" className="menu-item">
                  <img src="/src/image/inscripciones.svg" alt="registrar disciplinas" className="icon" />
                  &nbsp;&nbsp;registrar disciplinas
                  </Link>
                </li>
                <li className="enlace-admin">
                  <Link to="/admin" className="menu-item">
                  <img src="/src/image/admin.svg" alt="admin" className="icon" />
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
