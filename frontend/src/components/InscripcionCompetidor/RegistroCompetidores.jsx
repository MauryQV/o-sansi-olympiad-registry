import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatosRegistroCompetidor } from '../../hooks/useDatosRegistroCompetidor';
import '../../styles/InscripcionCompetidor/RegistroCompetidores.css';
import TablaPagos from './TablaPagos';

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

  const irAVistaPagos = (pago) => {
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
              <p><strong>{convocatoriaActiva.nombre}</strong></p>
              <p>{convocatoriaActiva.descripcion}</p>
              <p>
                Inscripción {convocatoriaActiva.fechaInicio} - {convocatoriaActiva.fechaFin}
              </p>
              <span className={`badge-estado ${convocatoriaActiva.estado?.toLowerCase().replace(/\s+/g, '-')}`}>{convocatoriaActiva.estado}</span>
            </>
          ) : (
            <p>No hay convocatorias activas.</p>
          )}
        </div>
      </div>

      <div className="tarjeta-pagos-box">
         <h3 className="titulo-tabla-pagos">Mis Pagos</h3>
         <TablaPagos pagos={pagos} onVerDetalles={irAVistaPagos} />
      </div>
    </div>
  );
};

export default RegistroCompetidores;
