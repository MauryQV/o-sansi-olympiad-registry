import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/InscripcionCompetidor/RegistroCompetidores.css';

const RegistroCompetidores = () => {
  const navigate = useNavigate();

  const [inscripcionesActivas, setInscripcionesActivas] = useState(0);
  const [pagosPendientes, setPagosPendientes] = useState(0);
  const [convocatoriasDisponibles, setConvocatoriasDisponibles] = useState(0);
  const [inscripcionActiva, setInscripcionActiva] = useState(null);
  const [convocatoriaActiva, setConvocatoriaActiva] = useState(null);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    // Datos ficticios simulando respuesta de la API
    setInscripcionesActivas(1);
    setPagosPendientes(1);
    setConvocatoriasDisponibles(2);

    setInscripcionActiva({
      area: 'Matemática',
      categoria: 'Quinto Nivel',
      grado: '5º',
      fecha: '01/03/2025',
      estado: 'Validada'
    });

    setConvocatoriaActiva({
      nombre: 'Olimpiada Científica Estudiantil 2025',
      descripcion: 'Convocatoria Anual para las olimpiadas científicas a nivel departamental',
      fechaInicio: '2025-03-01',
      fechaFin: '2025-04-07'
    });

    setPagos([
      {
        boleta: 'BOL-2025-001',
        area: 'Matemática',
        monto: 'Bs. 15.00',
        fecha: '01/04/2025',
        estado: 'Pendiente'
      }
    ]);
  }, []);

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
        <div className="tarjeta-inscripcion-activa">
          <h3 className="titulo-tarjeta">Mis Inscripciones</h3>
          {inscripcionActiva ? (
            <>
              <p><strong>{inscripcionActiva.area}</strong></p>
              <p>Categoría: {inscripcionActiva.categoria}, Grado: {inscripcionActiva.grado}</p>
              <p>Fecha: {inscripcionActiva.fecha}</p>
              <span className={`estado-inscripcion ${inscripcionActiva.estado.toLowerCase()}`}>
                {inscripcionActiva.estado}
              </span>
            </>
          ) : (
            <p>No tienes inscripciones activas.</p>
          )}
        </div>

        <div className="tarjeta-convocatoria-activa">
          <h3 className="titulo-tarjeta">Convocatorias Activas</h3>
          {convocatoriaActiva ? (
            <>
              <p><strong>{convocatoriaActiva.nombre}</strong></p>
              <p>{convocatoriaActiva.descripcion}</p>
              <p>Inscripción {convocatoriaActiva.fechaInicio} - {convocatoriaActiva.fechaFin}</p>
              <span className="estado-inscripcion en-inscripcion">En Inscripción</span>
            </>
          ) : (
            <p>No hay convocatorias activas.</p>
          )}
        </div>
      </div>

      <div className="seccion-tabla-pagos">
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


