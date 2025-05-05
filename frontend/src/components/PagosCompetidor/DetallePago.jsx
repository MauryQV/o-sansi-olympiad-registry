// src/components/DetallePago.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/PagosCompetidor/DetallePago.css';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { PDFDownloadLink } from '@react-pdf/renderer';

import descarga from '../../image/descarga.svg';
import casaInicio from '../../image/casaInicio.svg';
import tarjetaQr from '../../image/tarjetaQr.svg';
import BoletaPagoPDF from '../PagosCompetidor/BoletaPagoPDF.jsx'; 

const DetallePago = () => {
  const { boleta } = useParams();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState("caja");
  const [detallePago, setDetallePago] = useState(null);
  const [loading, setLoading] = useState(true);

  const volver = () => navigate('/pagos-competidor');

  useEffect(() => {
    // Simulación de datos del backendd
    const datosSimulados = {
      nombreCompetidor: "Luis Flores",
      ci: "9389739",
      area: "Matemática",
      fechaEmision: "2025-03-01",
      estado: "Pendiente",
      monto: 15.00
    };

    setTimeout(() => {
      setDetallePago(datosSimulados);
      setLoading(false);
    }, 500);
  }, [boleta]);

  if (loading) return <p style={{ padding: '2rem' }}>Cargando datos de pago...</p>;
  if (!detallePago) return <p style={{ padding: '2rem', color: 'red' }}>No se encontraron detalles para esta boleta.</p>;

  const { nombreCompetidor, ci, area, fechaEmision, estado, monto } = detallePago;

  return (
    <div className="detallepago-container">
      <div className="detallepago-header">
        <h2><b>Detalles de Pago</b></h2>
        <button className="detallepago-volver" onClick={volver}><b>Volver</b></button>
      </div>

      <div className="detallepago-tarjeta">
        <div className="detallepago-info">
          <div>
            <h3><b>Boleta de Pago: {boleta}</b></h3>
            <p className="detallepago-estado-texto">Pendiente de Pago</p>
            <br />
            <p className="detallepago-estado-texto">Competidor</p>
            <p><strong><b>Competidor {nombreCompetidor}</b></strong></p>
            <p className="detallepago-estado-texto">CI: {ci}</p>
            <br />
            <p className="detallepago-estado-texto">Monto</p>
            <span className="detallepago-monto">Bs. {monto.toFixed(2)}</span>
          </div>
          <div className="detalles-de-detalles-pago">
            <p>Detalles</p>
            <p className="detalle-area"><b>Área: {area}</b></p>
            <p><b>Emisión:</b> {fechaEmision}</p>
            <p><b>Estado:</b><br/><span className="detallepago-estado">{estado}</span></p>
          </div>
        </div>

        <hr/>

        <div className="detallepago-acciones">
          <PDFDownloadLink
            document={
              <BoletaPagoPDF
                boleta={boleta}
                nombre={nombreCompetidor}
                ci={ci}
                area={area}
                fechaEmision={fechaEmision}
                estado={estado}
                monto={monto}
              />
            }
            fileName={`boleta_${boleta}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <button className="detallepago-descargar">
                <img className='imagen-descargar' src={descarga} alt="descargar" />
                {loading ? 'Generando...' : 'Descargar Boleta'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="detallepago-pago">
        <h3><b>Realizar Pago</b></h3>
        <p className="detallepago-sub">Seleccione su método de pago preferido</p>
        <div className="detallepago-metodos">
          <button
            className={metodoPago === "caja" ? "activo" : ""}
            onClick={() => setMetodoPago("caja")}
          >
            <img className='imagen-casa' src={casaInicio} alt="caja"/>
            Pago en Caja
          </button>
          <button
            className={metodoPago === "qr" ? "activo" : ""}
            onClick={() => setMetodoPago("qr")}
          >
            <img className='imagen-casa' src={tarjetaQr} alt="tarjeta"/>
            Pago QR
          </button>
        </div>

        {metodoPago === "caja" ? (
          <div className="detallepago-instrucciones">
            <p><strong>Instrucciones para Pago en Caja</strong></p>
            <ol>
              <li>Acuda a la oficina en horario de atención (8:00 - 16:00).</li>
              <li>Presente su boleta Nº {boleta} en ventanilla.</li>
              <li>Realice el pago de Bs. {monto.toFixed(2)}.</li>
              <li>Conserve su recibo como comprobante.</li>
            </ol>
          </div>
        ) : (
          <div className="detallepago-instrucciones">
            <div className="detallepago-qr-img">
            <QRCode
              value={
                `Boleta de Pago\n` +
                `Boleta: ${boleta}\n` +
                `Nombre: ${nombreCompetidor}\n` +
                `Área: ${area}\n` +
                `CI: ${ci}\n` +
                `Monto: Bs. ${monto.toFixed(2)}`
              }
              size={150}
            />
            </div>
            <p className="detallepago-qr-texto">Escanee este código QR para pagar Bs. {monto.toFixed(2)}</p>
            <button className="detallepago-btn-qr-confirmar">Pago QR</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallePago;

