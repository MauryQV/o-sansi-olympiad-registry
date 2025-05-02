// src/components/cajero/TablaBoletas.jsx

import React from 'react';

const TablaBoletas = ({ boletas, onConfirmar }) => {
  if (boletas.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '1rem' }}>No se encontraron resultados.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>CÓDIGO</th>
          <th>COMPETIDOR</th>
          <th>CI</th>
          <th>MONTO</th>
          <th>FECHA</th>
          <th>ACCIÓN</th>
        </tr>
      </thead>
      <tbody>
        {boletas.map((b, i) => (
          <tr key={i}>
            <td>{b.codigo}</td>
            <td>{b.competidor}</td>
            <td>{b.ci}</td>
            <td>Bs. {b.monto.toFixed(2)}</td>
            <td>{b.fecha}</td>
            <td>
              <button className="btn-validar" onClick={() => onConfirmar(b)}>
                Validar Pago
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaBoletas;
