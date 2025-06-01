import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/PagosCompetidor/DetallePago.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

import descarga from '../../image/descarga.svg';
import casaInicio from '../../image/casaInicio.svg';
import tarjetaQr from '../../image/tarjetaQr.svg';
import BoletaPagoPDF from '../PagosCompetidor/BoletaPagoPDF.jsx'; 

const DetallePago = () => {
  const { boleta } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [metodoPago, setMetodoPago] = useState("caja");
  const [detallePago, setDetallePago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const volver = () => navigate('/pagos-competidor');

  const handleDownloadClick = useCallback(() => {
    setShowPDFModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowPDFModal(false);
  }, []);

  useEffect(() => {
    if (location.state && location.state.pago) {
      setDetallePago(location.state.pago);
      setLoading(false);
    } else {
      setError('No se encontraron los datos del pago');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) return <p style={{ padding: '2rem' }}>Cargando datos de pago...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;
  if (!detallePago) return <p style={{ padding: '2rem', color: 'red' }}>No se encontraron detalles para esta boleta.</p>;

  return (
    <div className="detallepago-container">
      <div className="detallepago-header">
        <h2><b>Detalles de Pago</b></h2>
        <button className="detallepago-volver" onClick={volver}><b>Volver</b></button>
      </div>

      <div className="detallepago-tarjeta">
        <div className="detallepago-info">
          <div>
            <h3><b>Boleta de Pago: {detallePago.codigo_boleta}</b></h3>
            <p className="detallepago-estado-texto">Pendiente de Pago</p>
            <br />
            <p className="detallepago-estado-texto">Competidor</p>
            <p><strong><b>Competidor {detallePago.nombre}</b></strong></p>
            <p className="detallepago-estado-texto">CI: {detallePago.ci}</p>
            <br />
            <p className="detallepago-estado-texto">Monto</p>
            <span className="detallepago-monto">{detallePago.monto}</span>
          </div>
          <div className="detalles-de-detalles-pago">
            <p>Detalles</p>
            <p className="detalle-area"><b>Área: {detallePago.area}</b></p>
            <p><b>Emisión:</b> {detallePago.fecha}</p>
            <p><b>Estado:</b><br/><span className="detallepago-estado">{detallePago.estado}</span></p>
          </div>
        </div>

        <hr/>

        <div className="detallepago-acciones">
          <button 
            className="detallepago-descargar"
            onClick={handleDownloadClick}
          >
            <img className='imagen-descargar' src={descarga} alt="descargar" />
            Descargar Boleta
          </button>
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
              <li>Presente su boleta Nº {detallePago.boleta} en ventanilla.</li>
              <li>Realice el pago de {detallePago.monto}.</li>
              <li>Conserve su recibo como comprobante.</li>
            </ol>
          </div>
        ) : (
          <div className="detallepago-instrucciones">
            <div className="detallepago-qr-img">
              <QRCode
                value={
                  `Boleta de Pago\n` +
                  `Boleta: ${detallePago.boleta}\n` +
                  `Nombre: ${detallePago.nombre}\n` +
                  `Área: ${detallePago.area}\n` +
                  `CI: ${detallePago.ci}\n` +
                  `Monto: ${detallePago.monto}`
                }
                size={150}
              />
            </div>
            <p className="detallepago-qr-texto">Escanee este código QR para pagar {detallePago.monto}</p>
            <button className="detallepago-btn-qr-confirmar">Pago QR</button>
          </div>
        )}
      </div>

      {showPDFModal && (
        <div className="pdf-modal-overlay" onClick={handleCloseModal}>
          <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Vista previa del PDF</h3>
              <button className="pdf-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="pdf-modal-body">
              <PDFViewer style={{ width: '100%', height: '80vh' }}>
                <BoletaPagoPDF
                  boleta={detallePago.codigo_boleta}
                  nombre={detallePago.nombre || ''}
                  ci={detallePago.ci || ''}
                  area={detallePago.area}
                  fechaEmision={detallePago.fecha}
                  estado={detallePago.estado}
                  monto={parseFloat(detallePago.monto.replace('Bs. ', ''))}
                />
              </PDFViewer>
            </div>
            <div className="pdf-modal-footer">
              <PDFDownloadLink
                document={
                  <BoletaPagoPDF
                    boleta={detallePago.boleta}
                    nombre={detallePago.nombre || ''}
                    ci={detallePago.ci || ''}
                    area={detallePago.area}
                    fechaEmision={detallePago.fecha}
                    estado={detallePago.estado}
                    monto={parseFloat(detallePago.monto.replace('Bs. ', ''))}
                  />
                }
                fileName={`boleta_${detallePago.codigo_boleta}.pdf`}
                style={{ textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <button className="pdf-download-button">
                    {loading ? 'Generando...' : 'Descargar PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallePago;

