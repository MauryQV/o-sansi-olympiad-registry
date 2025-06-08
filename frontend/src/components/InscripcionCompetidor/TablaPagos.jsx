import React from 'react';

const TablaPagos = ({ pagos, onVerDetalles }) => (
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
          <tr key={pago.id || index}>
            <td>{pago.boleta || pago.codigo_boleta || pago.codigo_pago}</td>
            <td>{pago.area}</td>
            <td>{pago.monto}</td>
            <td>{pago.fecha}</td>
            <td>
              <span className={`estado-inscripcion ${pago.estado?.toLowerCase()}`}>{pago.estado}</span>
            </td>
            <td>
              <button className="boton-ver-detalles" onClick={() => onVerDetalles(pago)}>
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
);

export default TablaPagos; 