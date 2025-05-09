import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InicioCajero.css';

const InicioCajero = () => {
  const navigate = useNavigate();

  const boletasTotales = 2;
  const boletasPendientes = 1;
  const boletasPagadas = 1;
  const boletasCanceladas = 0;

  const pagosRealizados = [
    {
      boleta: 'BOL-2025-001',
      nombre: 'Lidia Veizaga',
      ci: '4567890',
      monto: 'Bs. 15.00',
      fecha: '2025-04-01',
    },
  ];

  const pagosPendientes = [
    {
      boleta: 'BOL-2025-001',
      nombre: 'Lidia Veizaga',
      ci: '4567890',
      monto: 'Bs. 15.00',
      fecha: '2025-04-02',
    },
  ];

  return (
    <div className="inicio-cajero-wrapper">
      <h2 className="inicio-cajero-titulo">Panel de Caja</h2>

      <div className="inicio-cajero-content">
        <div className="inicio-cajero-cards">
          <div className="inicio-cajero-card">
            <p className="inicio-cajero-label">Total Boletas</p>
            <p className="inicio-cajero-valor">{boletasTotales}</p>
          </div>
          <div className="inicio-cajero-card pendiente">
            <p className="inicio-cajero-label">Pendientes</p>
            <p className="inicio-cajero-valor">{boletasPendientes}</p>
          </div>
          <div className="inicio-cajero-card pagado">
            <p className="inicio-cajero-label">Pagadas</p>
            <p className="inicio-cajero-valor">{boletasPagadas}</p>
          </div>
          <div className="inicio-cajero-card cancelado">
            <p className="inicio-cajero-label">Canceladas</p>
            <p className="inicio-cajero-valor">{boletasCanceladas}</p>
          </div>
        </div>

        <div className="inicio-cajero-seccion">
          <h3 className="inicio-cajero-subtitulo">Pagos Realizados</h3>
          <table className="inicio-cajero-tabla">
            <thead>
              <tr>
                <th>BOLETA</th>
                <th>COMPETIDOR</th>
                <th>CI</th>
                <th>MONTO</th>
                <th>FECHA</th>
              </tr>
            </thead>
            <tbody>
              {pagosRealizados.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.boleta}</td>
                  <td>{pago.nombre}</td>
                  <td>{pago.ci}</td>
                  <td>{pago.monto}</td>
                  <td>{pago.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inicio-cajero-boton-contenedor">
            <button className="inicio-cajero-btn" onClick={() => navigate('/pagos')}>
              Ver todos los pagos
            </button>
          </div>
        </div>

        <div className="inicio-cajero-seccion">
          <h3 className="inicio-cajero-subtitulo">Pagos Pendientes Recientes</h3>
          <table className="inicio-cajero-tabla">
            <thead>
              <tr>
                <th>BOLETA</th>
                <th>COMPETIDOR</th>
                <th>CI</th>
                <th>MONTO</th>
                <th>FECHA</th>
              </tr>
            </thead>
            <tbody>
              {pagosPendientes.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.boleta}</td>
                  <td>{pago.nombre}</td>
                  <td>{pago.ci}</td>
                  <td>{pago.monto}</td>
                  <td>{pago.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inicio-cajero-boton-contenedor">
            <button className="inicio-cajero-btn" onClick={() => navigate('/pagos')}>
              Ver todos los pagos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioCajero;
