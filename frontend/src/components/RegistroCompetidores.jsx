import React from 'react';
import '../styles/RegistroCompetidores.css';

const RegistroCompetidores = () => {
  return (
    <div className="registro-competidores-contenedor">
      <h2 className="dashboard-titulo">Bienvenido</h2>

      <div className="seccion-resumen-estadisticas">
        <div className="tarjeta-estadistica">
          <p>Inscripciones Activas</p>
          <h3>1</h3>
        </div>
        <div className="tarjeta-estadistica">
          <p>Pagos Pendientes</p>
          <h3>1</h3>
        </div>
        <div className="tarjeta-estadistica">
          <p>Convocatorias Disponibles</p>
          <h3>2</h3>
        </div>
      </div>

      <div className="contenedor-info-tarjetas">
        <div className="tarjeta-inscripcion-activa">
          <h3 className="titulo-tarjeta">Mis Inscripciones</h3>
          <p><strong>Matemática</strong></p>
          <p>Categoría: Quinto Nivel, Grado : 5º</p>
          <p>Fecha: 01/03/2025</p>
          <span className="estado-inscripcion validada">Validada</span>
        </div>

        <div className="tarjeta-convocatoria-activa">
          <h3 className="titulo-tarjeta">Convocatorias Activas</h3>
          <p><strong>Olimpiada Científica Estudiantil 2025</strong></p>
          <p>Convocatoria Anual para las olimpiadas científicas a nivel departamental</p>
          <p>Inscripción 2025-03-01 - 2025-04-07</p>
          <span className="estado-inscripcion en-inscripcion">En Inscripción</span>
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
            <tr>
              <td>BOL-2025-001</td>
              <td>Matemática</td>
              <td>Bs. 15.00</td>
              <td>01/04/2025</td>
              <td><span className="estado-inscripcion pendiente">Pendiente</span></td>
              <td><button className="boton-ver-detalles">Ver Detalles</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroCompetidores;
