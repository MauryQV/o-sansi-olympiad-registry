import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useEffect } from "react";
import usuario from "../image/user.svg";
import { useAuth } from "../context/authContext";
import { useNotifications } from "../hooks/useNotificaciones";
import logo from "../image/logo.png";
import campana from "../image/campana-notificacion.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { usuario: usuarioAuth, logout } = useAuth();

  // Sistema de notificaciones unificado
  const {
    notificaciones,
    loading: loadingNotif,
    contadorNoLeidas,
    marcarComoLeida,
    eliminarNotificacion,
    marcarTodasComoLeidas
  } = useNotifications();

  // Estados para mostrar/ocultar paneles
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [mostrarNotifComp, setMostrarNotifComp] = useState(false);

  // Determinar el rol basado en el rol_id
  const getRol = () => {
    if (!usuarioAuth) return null;

    switch (usuarioAuth.rol_id) {
      case 1:
        return "admin";
      case 2:
        return "competidor";
      case 3:
        return "cajero";
      case 4:
        return "tutor";
      default:
        return null;
    }
  };

  const rol = getRol();

  // Filtrar notificaciones según el tipo para el tutor
  const solicitudesPendientes = notificaciones.filter(n => 
    n.tipo === 'solicitud' && !n.leido
  );

  // Debug: mostrar en consola las notificaciones cargadas
  useEffect(() => {
    console.log('Notificaciones en Navbar:', notificaciones);
    console.log('Contador no leídas:', contadorNoLeidas);
    console.log('Solicitudes pendientes (tutor):', solicitudesPendientes);
  }, [notificaciones, contadorNoLeidas, solicitudesPendientes]);

  const handleCerrarNotificacion = async (id) => {
    await eliminarNotificacion(id);
  };

  const limpiarTodasNotificaciones = async () => {
    await marcarTodasComoLeidas();
    setMostrarNotifComp(false);
    setMostrarNotificaciones(false);
  };

  const handleAceptar = async (id) => {
    // Aquí deberías hacer la llamada a la API para aceptar la solicitud
    try {
      // await aceptarSolicitud(id); // Tu función para aceptar
      await marcarComoLeida(id); // Marcar como leída
      console.log('Solicitud aceptada:', id);
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
    }
  };

  const handleRechazar = async (id) => {
    // Aquí deberías hacer la llamada a la API para rechazar la solicitud
    try {
      // await rechazarSolicitud(id); // Tu función para rechazar
      await marcarComoLeida(id); // Marcar como leída
      console.log('Solicitud rechazada:', id);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      {/* Menú de navegación */}
      <div className="link-pagina">
        <div className="imagen-completa">
          <img className="imagen-nav" src={logo} alt="Logo" />
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
                <li>
                  <Link to="/" className="menu-item">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/areas" className="menu-item">
                    Áreas
                  </Link>
                </li>
                <li>
                  <Link to="/disciplinas" className="menu-item">
                    Convocatorias
                  </Link>
                </li>
                <li>
                  <Link to="/acerca" className="menu-item">
                    Acerca de..
                  </Link>
                </li>
              </>
            )}

            {rol === "admin" && (
              <>
                <li>
                  <Link to="/inicio-admin" className="menu-item">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/areas-admin" className="menu-item">
                    Áreas
                  </Link>
                </li>
                <li>
                  <Link to="/convocatorias" className="menu-item">
                    Convocatorias
                  </Link>
                </li>
                <li>
                  <Link to="/usuarios" className="menu-item">
                    Usuarios
                  </Link>
                </li>
                <li>
                  <Link to="/reportes" className="menu-item">
                    Reportes
                  </Link>
                </li>
                <li className="dropdown">
                  <div className="menu-rol">
                    <img className="imagen-user" src={usuario} alt="usuario" />
                    <span className="rol-nombre">Admin ▾</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li className="cerrar-sesion" onClick={handleLogout}>
                      Cerrar sesión
                    </li>
                  </ul>
                </li>
              </>
            )}

            {rol === "tutor" && (
              <>
                <li>
                  <Link to="/inicio-tutor" className="menu-item">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/solicitudes" className="menu-item">
                    Solicitudes
                  </Link>
                </li>
                <li>
                  <Link to="/competidores-asignados" className="menu-item">
                    Mis Competidores
                  </Link>
                </li>
                <li className="campanita">
                  <div
                    className="campana-notificacion"
                    onClick={() =>
                      setMostrarNotificaciones(!mostrarNotificaciones)
                    }
                  >
                    <img src={campana} alt="Notificaciones" />
                    {solicitudesPendientes.length > 0 && (
                      <span className="notificacion-circulo">
                        {solicitudesPendientes.length}
                      </span>
                    )}
                  </div>
                </li>
                <li className="dropdown">
                  <div className="menu-rol">
                    <img className="imagen-user" src={usuario} alt="usuario" />
                    <span className="rol-nombre">Tutor ▾</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li className="cerrar-sesion" onClick={handleLogout}>
                      Cerrar sesión
                    </li>
                  </ul>
                </li>
              </>
            )}

            {rol === "competidor" && (
              <>
                <li>
                  <Link to="/inicio-competidor" className="menu-item">
                    Inicio{" "}
                  </Link>
                </li>
                <li>
                  <Link to="/inscripcion" className="menu-item">
                    Inscripción
                  </Link>
                </li>
                <li>
                  <Link to="/mis-inscripciones" className="menu-item">
                    Mis Inscripciones
                  </Link>
                </li>
                <li>
                  <Link to="/pagos-competidor" className="menu-item">
                    Pagos
                  </Link>
                </li>
                <li className="campanita">
                  <div
                    className="campana-notificacion"
                    onClick={() => setMostrarNotifComp(!mostrarNotifComp)}
                  >
                    <img src={campana} alt="Notificaciones" />
                    {contadorNoLeidas > 0 && (
                      <span className="notificacion-circulo">
                        {contadorNoLeidas}
                      </span>
                    )}
                  </div>
                </li>

                <li className="dropdown">
                  <div className="menu-rol">
                    <img className="imagen-user" src={usuario} alt="usuario" />
                    <span className="rol-nombre">Competidor ▾</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li className="cerrar-sesion" onClick={handleLogout}>
                      Cerrar sesión
                    </li>
                  </ul>
                </li>
              </>
            )}

            {rol === "cajero" && (
              <>
                <li>
                  <Link to="/inicio-cajero" className="menu-item">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/pagos" className="menu-item">
                    Pagos
                  </Link>
                </li>
                <li className="dropdown">
                  <div className="menu-rol">
                    <img className="imagen-user" src={usuario} alt="usuario" />
                    <span className="rol-nombre">Cajero ▾</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li className="cerrar-sesion" onClick={handleLogout}>
                      Cerrar sesión
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          {!rol && (
            <div className="botones-sesion">
              <Link to="/login" className="btn-login">
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="btn-registrarse">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Panel de solicitudes pendientes para tutor */}
      {mostrarNotificaciones && rol === "tutor" && (
        <div className="panel-notificaciones">
          <h4>Solicitudes pendientes</h4>
          <div className="lista-notificaciones">
            {loadingNotif ? (
              <p>Cargando solicitudes...</p>
            ) : solicitudesPendientes.length > 0 ? (
              <>
                {solicitudesPendientes.map((n) => (
                  <div key={n.id} className="notificacion-item">
                    <p>
                      <strong>{n.mensaje}</strong>
                    </p>
                    <small className="fecha">{n.fecha}</small>
                    <div className="acciones">
                      <button
                        className="rechazar"
                        onClick={() => handleRechazar(n.id)}
                      >
                        Rechazar
                      </button>
                      <button
                        className="aceptar"
                        onClick={() => handleAceptar(n.id)}
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="notif-actions">
                  <button
                    className="limpiar-notif"
                    onClick={limpiarTodasNotificaciones}
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              </>
            ) : (
              <p>No tienes solicitudes pendientes.</p>
            )}
          </div>
        </div>
      )}

      {/* Panel de notificaciones para competidor */}
      {mostrarNotifComp && rol === "competidor" && (
        <div className="panel-notificaciones">
          <h4>Notificaciones</h4>
          <div className="lista-notificaciones">
            {loadingNotif ? (
              <p>Cargando notificaciones...</p>
            ) : notificaciones.length > 0 ? (
              <>
                {notificaciones.map((n) => (
                  <div key={n.id} className={`notificacion-item ${!n.leido ? 'no-leida' : ''}`}>
                    <div className="notif-header">
                      <p className="mensaje">
                        <strong>{n.mensaje}</strong>
                      </p>
                      {n.motivo && (
                        <p className="motivo">
                          <em>Motivo: {n.motivo}</em>
                        </p>
                      )}
                      <small className="fecha">{n.fecha}</small>
                      {!n.leido && (
                        <button
                          className="marcar-leida"
                          onClick={() => marcarComoLeida(n.id)}
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                    <button
                      className="cerrar-notif"
                      onClick={() => handleCerrarNotificacion(n.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="notif-actions">
                  <button
                    className="limpiar-notif"
                    onClick={limpiarTodasNotificaciones}
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              </>
            ) : (
              <p>No tienes notificaciones.</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;