import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import '../styles/Navbar.css'
import usuario from '../image/user.svg';

const Navbar = ({ rol, setRol }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);



  return (
    <nav className="nav">

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
          <div className="imagen-completa">
            <img className="imagen-nav" src="/src/image/logo.png"></img>
            <div className="linea-vertical"></div>

            <div className="texto-sansi">
              <span>Olimpiadas</span>
              <span>Científicas</span>
              <span>Estudiantiles</span>
            </div>
          </div>
          <div className="links-derecha">
            <ul className={`menu ${isOpen ? "open" : "hidden"}`} id="links">

              {!rol && (
                <>
                  <li><Link to="/" className="menu-item">Inicio</Link></li>
                  <li><Link to="/inscripciones" className="menu-item">Áreas</Link></li>
                  <li><Link to="/disciplinas" className="menu-item">Convocatorias</Link></li>
                  <li><Link to="/acerca" className="menu-item">Acerca de..</Link></li>
                </>
              )}

              {rol === 'admin' && (
                <>
                  <li><Link to="/inicio-admin" className="menu-item">Inicio (Admin)</Link></li>
                  <li><Link to="/areas-admin" className="menu-item">Áreas</Link></li>
                  <li><Link to="/convocatorias" className="menu-item">Convocatorias</Link></li>
                  <li><Link to="/usuarios" className="menu-item">Usuarios</Link></li>
                  <li><Link to="/reportes" className="menu-item">Reportes</Link></li>
                  <li className="dropdown">
                    <div className="menu-rol">
                      <img className="imagen-user" src={usuario} alt="usuario" />
                      <span className="rol-nombre">Admin ▾</span>
                    </div>
                    <ul className="dropdown-menu">
                      <li className="cerrar-sesion" onClick={() => {
                        setRol(null);
                        navigate("/");
                      }}>Cerrar sesión
                      </li>
                    </ul>
                  </li>
                </>
              )}

              {rol === 'tutor' && (
                <>
                  <li><Link to="/inicio-tutor" className="menu-item">Inicio (Tutor)</Link></li>
                  <li><Link to="/solicitudes" className="menu-item">Solicitudes</Link></li>
                  <li className="dropdown">
                    <div className="menu-rol">
                      <img className="imagen-user" src={usuario} alt="usuario" />
                      <span className="rol-nombre">Tutor ▾</span>
                    </div>
                    <ul className="dropdown-menu">
                      <li className="cerrar-sesion" onClick={() => {
                        setRol(null);
                        navigate("/");
                      }}>Cerrar sesión
                      </li>
                    </ul>
                  </li>
                </>
              )}

              {rol === 'competidor' && (
                <>
                  <li><Link to="/inicio-competidor" className="menu-item">Inicio </Link></li>
                  <li><Link to="/inscripcion" className="menu-item">Inscripción</Link></li>
                  <li><Link to="/pagos-competidor" className="menu-item">Pagos</Link></li>
                  <li className="dropdown">
                    <div className="menu-rol">
                      <img className="imagen-user" src={usuario} alt="usuario" />
                      <span className="rol-nombre">Competidor ▾</span>
                    </div>
                    <ul className="dropdown-menu">
                      <li className="cerrar-sesion" onClick={() => {
                          setRol(null);
                          navigate("/");
                        }}>Cerrar sesión
                      </li>
                    </ul>
                  </li>
                </>
              )}

              {rol === 'cajero' && (
                <>
                  <li><Link to="/inicio-cajero" className="menu-item">Inicio (Cajero)</Link></li>
                  <li><Link to="/pagos" className="menu-item">Pagos</Link></li>
                  <li className="dropdown">
                    <div className="menu-rol">
                      <img className="imagen-user" src={usuario} alt="usuario" />
                      <span className="rol-nombre">Cajero ▾</span>
                    </div>
                    <ul className="dropdown-menu">
                      <li className="cerrar-sesion" onClick={() => {
                          setRol(null);
                          navigate("/");
                        }}>Cerrar sesión
                      </li>
                    </ul>
                  </li>
                </>
              )}

            </ul>
            {!rol && (
              <div className="botones-sesion">
                <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                <Link to="/registro" className="btn-registrarse">Registrarse</Link>
              </div>
            )}
          </div>


        </div>
      
    </nav>
  );
};

export default Navbar;
