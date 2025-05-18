import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InicioTutor.css";

const InicioTutor = () => {
  const navigate = useNavigate();

  const pendientes = [
    {
      id: 1,
      nombre: "Maria Gonzáles",
      area: "Matemática - Categoría: Quinto Nivel",
      grado: "5to de Secundaria",
    },
    {
      id: 2,
      nombre: "Juan Pérez",
      area: "Física - Categoría: 4S",
      grado: "4to de Secundaria",
    },
  ];

  return (
    <div className="tutor-inicio-wrapper">
      <h2 className="tutor-inicio-titulo">Panel de Tutor</h2>

      <div className="tutor-inicio-content">
        {" "}
        {/* Nuevo contenedor para alinear */}
        <div className="tutor-inicio-cards">
          <div className="tutor-inicio-card">
            <p className="tutor-inicio-card-label">Solicitudes Pendientes</p>
            <p className="tutor-inicio-card-valor">{pendientes.length}</p>
          </div>
          <div className="tutor-inicio-card">
            <p className="tutor-inicio-card-label">Competidores Asignados</p>
            <p className="tutor-inicio-card-valor">1</p>
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
              {pendientes.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.nombre}</strong>
                  </td>
                  <td>{s.area}</td>
                  <td>{s.grado}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tutor-inicio-btn-contenedor">
            <button
              className="tutor-inicio-btn"
              onClick={() => navigate("/solicitudes")}
            >
              Ver Todas las Solicitudes
            </button>
            <button
              className="tutor-inicio-btn tutor-inicio-btn-verde"
              onClick={() => navigate("/competidores-asignados")}
            >
              Ver Mis Competidores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioTutor;
