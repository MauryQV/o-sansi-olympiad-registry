import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatosRegistroCompetidor } from '../../hooks/useDatosRegistroCompetidor';
import '../../styles/InscripcionCompetidor/RegistroCompetidores.css';

const RegistroCompetidores = () => {
  const navigate = useNavigate();
  const {
    inscripcionesActivas,
    pagosPendientes,
    convocatoriasDisponibles,
    inscripcionActiva,
    convocatoriaActiva,
    pagos
  } = useDatosRegistroCompetidor();

  const irAVistaPagos = () => {
    navigate('/pagos-competidor');
  };

  return (
    <div className="registro-competidores-contenedor">
      <h2 className="dashboard-titulo">Bienvenido</h2>

      <div className="seccion-resumen-estadisticas">
        <div className="tarjeta-estadistica">
          <p>Inscripciones Activas</p>
          <h3>{inscripcionesActivas}</h3>
        </div>
        <div className="tarjeta-estadistica">
          <p>Pagos Pendientes</p>
          <h3>{pagosPendientes}</h3>
        </div>
        <div className="tarjeta-estadistica">
          <p>Convocatorias Disponibles</p>
          <h3>{convocatoriasDisponibles}</h3>
        </div>
      </div>

      <div className="contenedor-info-tarjetas">
        <div className="tarjeta-inscripcion-activa posicion-con-estado">
          <h3 className="titulo-tarjeta">Mis Inscripciones</h3>
          {inscripcionActiva ? (
            <>
              <p><strong>{inscripcionActiva.area}</strong></p>
              <p>Categoría: {inscripcionActiva.categoria}, Grado: {inscripcionActiva.grado}</p>
              <p>Fecha: {inscripcionActiva.fecha}</p>
              <span className={`badge-estado validada`}>
                {inscripcionActiva.estado}
              </span>
            </>
          ) : (
            <p>No tienes inscripciones activas.</p>
          )}
        </div>

        <div className="tarjeta-convocatoria-activa posicion-con-estado">
          <h3 className="titulo-tarjeta">Convocatorias Activas</h3>
          {convocatoriaActiva ? (
            <>
              <p><strong>{convocatoriaActiva.nombre_convocatoria}</strong></p>
              <p>{convocatoriaActiva.descripcion_convocatoria}</p>
              <p>
                Inscripción {new Date(convocatoriaActiva.fecha_inicio).toLocaleDateString()} - {new Date(convocatoriaActiva.competicion_fin).toLocaleDateString()}
            </p>
              <span className="badge-estado en-inscripcion">En Inscripción</span>
            </>
          ) : (
            <p>No hay convocatorias activas.</p>
          )}
        </div>
      </div>

      <div className="tarjeta-pagos-box">
         <h3 className="titulo-tabla-pagos">Mis Pagos</h3>
          <table className="tabla-pagos">
          <thead>
            <tr>
              <th>BOLETA</th>
              <th>ÁREA</th>
              <th>MONTO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? (
              pagos.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.boleta}</td>
                  <td>{pago.area}</td>
                  <td>{pago.monto}</td>
                  <td>{pago.fecha}</td>
                  <td>
                    <span className={`estado-inscripcion ${pago.estado.toLowerCase()}`}>
                      {pago.estado}
                    </span>
                  </td>
                  <td>
                    <button className="boton-ver-detalles" onClick={irAVistaPagos}>
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No tienes pagos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroCompetidores;
