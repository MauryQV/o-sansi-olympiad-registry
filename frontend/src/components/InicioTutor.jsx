import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerSolicitudesPendientes, obtenerCompetidoresAsignados } from "../services/tutorService";
import "../styles/InicioTutor.css";

const InicioTutor = () => {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const solicitudesData = await obtenerSolicitudesPendientes();
        const competidoresData = await obtenerCompetidoresAsignados();
        setSolicitudes(solicitudesData);
        setCompetidores(competidoresData);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="tutor-inicio-wrapper">
      <h2 className="tutor-inicio-titulo">Panel de Tutor</h2>

      <div className="tutor-inicio-content">
        <div className="tutor-inicio-cards">
          <div className="tutor-inicio-card">
            <p className="tutor-inicio-card-label">Solicitudes Pendientes</p>
            <p className="tutor-inicio-card-valor">{solicitudes.length}</p>
          </div>
          <div className="tutor-inicio-card">
            <p className="tutor-inicio-card-label">Competidores Asignados</p>
            <p className="tutor-inicio-card-valor">{competidores.length}</p>
          </div>
          <div className="tutor-inicio-card">
            <p className="tutor-inicio-card-label">Mi Rol</p>
            <p className="tutor-inicio-card-valor">Tutor</p>
          </div>
        </div>

        <div className="tutor-inicio-tabla-box">
          <h3 className="tutor-inicio-tabla-titulo">Solicitudes Pendientes</h3>
          <table className="tutor-inicio-tabla">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Área y Categoría</th>
                <th>Grado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s, i) => (
                <tr key={i}>
                  <td><strong>{s.nombre_completo}</strong></td>
                  <td>{s.area_nombre} - Categoría: {s.categoria_nombre}</td>
                  <td>{s.grado}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tutor-inicio-btn-contenedor">
            <button className="tutor-inicio-btn" onClick={() => navigate("/solicitudes")}>
              Ver Todas las Solicitudes
            </button>
            <button className="tutor-inicio-btn tutor-inicio-btn-verde" onClick={() => navigate("/competidores-asignados")}>
              Ver Mis Competidores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioTutor;
