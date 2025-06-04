// src/components/cajero/TablaBoletas.jsx

import React from 'react';
import '../../styles/cajero/TablaBoletas.css';

const TablaBoletas = ({ boletas, onConfirmar, mostrarBotonValidar }) => {
  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'pagado':
        return 'estado-pagado';
      case 'validado':
        return 'estado-validado';
      case 'cancelado':
        return 'estado-cancelado';
      default:
        return '';
    }
  };

  if (!boletas || boletas.length === 0) {
    return (
      <div className="no-boletas">
        <p>No hay boletas para mostrar</p>
      </div>
    );
  }

  return (
    <div className="tabla-boletas-container">
      <table className="tabla-boletas">
        <thead>
          <tr>
            <th>Código</th>
            <th>Competidor</th>
            <th>CI</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            {mostrarBotonValidar && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {boletas.map((boleta) => (
            <tr key={boleta.id}>
              <td>{boleta.codigo}</td>
              <td>{boleta.competidor}</td>
              <td>{boleta.ci}</td>
              <td>Bs. {boleta.monto.toFixed(2)}</td>
              <td>{boleta.fecha}</td>
              <td>
                <span className={`estado-badge ${boleta.estado.toLowerCase()}`}>
                  {boleta.estado}
                </span>
              </td>
              {mostrarBotonValidar && (
                <td>
                  <button
                    className="btn-validar"
                    onClick={() => onConfirmar(boleta)}
                    disabled={boleta.estado === 'Pagado'}
                  >
                    Cobrar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaBoletas;
