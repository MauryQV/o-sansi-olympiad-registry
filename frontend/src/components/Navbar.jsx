import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useEffect } from "react";
import usuario from "../image/user.svg";
import { useAuth } from "../context/authContext";
import { useSocket } from "../context/socketContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { usuario: usuarioAuth, logout } = useAuth();

  // Sistema de notificaciones para ambos roles
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesComp, setNotificacionesComp] = useState([]);
  const [notificationCounter, setNotificationCounter] = useState(1);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [mostrarNotifComp, setMostrarNotifComp] = useState(false);
  const { socket } = useSocket();

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

  // Escuchar notificaciones para competidor
  useEffect(() => {
    if (socket && rol === "competidor") {
      // Eliminar primero cualquier listener existente para evitar duplicados
      socket.off("notificacion:resultadoSolicitud");
      socket.off("notificacion:competidor");
      socket.off("notificacion:nueva");

      // Escuchar el evento que envía el backend (notificacion:nueva)
      socket.on("notificacion:nueva", (data) => {
        console.log("Notificación recibida por competidor:", data);

        // Agregar la nueva notificación al inicio del array con un ID único
        setNotificacionesComp((prev) => [
          {
            id: Date.now(),
            mensaje: data.mensaje || "Nueva notificación",
            fecha: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      });

      // Mantener también los otros listeners por si acaso se usan en otro lado
      socket.on("notificacion:resultadoSolicitud", (data) => {
        console.log("Notificación de resultado recibida por competidor:", data);

        const esRechazo = data.mensaje?.toLowerCase().includes("rechazada"); //esto

        setNotificacionesComp((prev) => [
          {
            id: Date.now(),
            mensaje: data.mensaje || "Resultado de tu solicitud",
            motivo: esRechazo
              ? data.motivoRechazo || "Sin motivo especificado"
              : null, //esto
            fecha: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      });

      socket.on("notificacion:competidor", (data) => {
        console.log("Notificación general para competidor:", data);

        setNotificacionesComp((prev) => [
          {
            id: Date.now(),
            mensaje: data.mensaje || "Nueva notificación",
            fecha: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      });
    }

    return () => {
      if (socket && rol === "competidor") {
        socket.off("notificacion:resultadoSolicitud");
        socket.off("notificacion:competidor");
        socket.off("notificacion:nueva");
      }
    };
  }, [socket, rol]);

  // Escuchar notificaciones para tutor
  useEffect(() => {
    if (socket && rol === "tutor") {
      console.log("Configurando listener para notificaciones");

      socket.off("notificacion:nueva");
      socket.on("notificacion:nueva", (data) => {
        console.log("Notificación recibida:", data);

        const newId = notificationCounter;
        setNotificationCounter((prev) => prev + 1);

        setNotificaciones((prev) => [
          {
            id: newId,
            mensaje: data.mensaje || "Nueva solicitud recibida",
            detalle: "Tienes una nueva solicitud pendiente",
            fecha: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      });
    }

    return () => {
      if (socket && rol === "tutor") {
        console.log("Limpiando listener de notificaciones");
        socket.off("notificacion:nueva");
      }
    };
  }, [socket, notificationCounter, rol]);

  // Simular una notificación inicial para competidor si es necesario para pruebas
  useEffect(() => {
    if (rol === "competidor" && notificacionesComp.length === 0) {
      // Puedes comentar esto en producción, esto es solo para probar

      setNotificacionesComp([
        /*
      {
        id: Date.now(),
        mensaje: 'Tu solicitud fue aceptada',
        motivo: null,
        fecha: new Date().toLocaleString()
      }
      */
        {
          id: Date.now(),
          mensaje: "Tu solicitud fue rechazada",
          motivo: "Falta de documentos obligatorios",
          fecha: new Date().toLocaleString(),
        },
      ]);
    }
  }, [rol]);

  const handleCerrarNotificacion = (id) => {
    setNotificacionesComp((prev) => prev.filter((n) => n.id !== id));
  };

  const limpiarTodasNotificaciones = () => {
    setNotificacionesComp([]);
    setMostrarNotifComp(false);
  };

  const handleAceptar = (id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const handleRechazar = (id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
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
                    <img
                      src="/src/image/campana-notificacion.svg"
                      alt="Notificaciones"
                    />
                    {notificaciones.length > 0 && (
                      <span className="notificacion-circulo">
                        {notificaciones.length}
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
                    <img
                      src="/src/image/campana-notificacion.svg"
                      alt="Notificaciones"
                    />
                    {notificacionesComp.length > 0 && (
                      <span className="notificacion-circulo">
                        {notificacionesComp.length}
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
      {mostrarNotificaciones && (
        <div className="panel-notificaciones">
          <h4>Solicitudes pendientes</h4>
          <div className="lista-notificaciones">
            {notificaciones.map((n) => (
              <div key={n.id} className="notificacion-item">
                <p>
                  <strong>{n.mensaje}</strong>
                </p>
                <p className="detalle">{n.detalle}</p>
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
            {notificaciones.length === 0 && (
              <p>No tienes solicitudes pendientes.</p>
            )}
          </div>
        </div>
      )}

      {mostrarNotifComp && (
        <div className="panel-notificaciones">
          <h4>Notificaciones</h4>
          <div className="lista-notificaciones">
            {notificacionesComp.length > 0 ? (
              <>
                {notificacionesComp.map((n) => (
                  <div key={n.id} className="notificacion-item">
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
                    Limpiar todas
                  </button>
                </div>
              </>
            ) : (
              <p>No tienes notificaciones nuevas.</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
