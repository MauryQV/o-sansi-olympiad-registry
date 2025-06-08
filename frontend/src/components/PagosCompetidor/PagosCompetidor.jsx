import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/PagosCompetidor/PagosCompetidor.css';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import BoletaPagoPDF from './BoletaPagoPDF.jsx';
import descarga from '../../image/descarga.svg';

const PagosCompetidor = () => {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleDownloadClick = useCallback((pago) => {
    if (pago.estado === 'Pagado') {
      setSelectedPago(pago);
      setShowPDFModal(true);
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowPDFModal(false);
    setSelectedPago(null);
  }, []);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/pagos');
        if (!response.ok) {
          throw new Error('Error al cargar los pagos');
        }
        const data = await response.json();
        setPagos(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  const handleVerDetalle = (pago) => {
    navigate(`/detalle-pago/${pago.boleta}`, { state: { pago } });
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando pagos...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div className="pagos-competidor-container">
      <div className="pagos-competidor-header">
        <h2><b>Mis Pagos</b></h2>
      </div>

      <p className="pagos-competidor-mensaje-advertencia">
        Solo se permiten realizar los pagos mientras estés en el periodo de pagos
      </p>

      {showAlert && (
        <div className="alert-message">
          Solo puedes visualizar y descargar la boleta cuando el pago haya sido aprobado
        </div>
      )}
      <div className="pagos-competidor-list">
        {pagos.map((pago) => (
          <div key={pago.boleta} className="pagos-competidor-card">
            <div className="pagos-competidor-info">
              <div>
                <h3><b>Boleta de Pago: {pago.boleta}</b></h3>
                <p className="pagos-competidor-estado-texto">Pendiente de Pago </p>
                <br />
                <p className="pagos-competidor-estado-texto">Competidor   abc123</p>
                <p><strong><b>Competidor {pago.nombre}</b></strong></p>
                <p className="pagos-competidor-estado-texto">CI: {pago.ci}</p>
                <br />
                <p className="pagos-competidor-estado-texto">Monto</p>
                <span className="pagos-competidor-monto">{pago.monto}</span>
              </div>
              <div className="detalles-de-pago">
                <p>Detalles</p>
                <p className="detalle-area"><b>Área: {pago.area}</b></p>
                <p><b>Emisión:</b> {pago.fecha}</p>
                <p><b>Estado:</b><br/><span className="pagos-competidor-estado">{pago.estado}</span></p>
              </div>
            </div>

            <hr/>

            <div className="pagos-competidor-acciones">
              {pago.estado === 'Pagado' ? (
                <button 
                  className="pagos-competidor-descargar"
                  onClick={() => handleDownloadClick(pago)}
                >
                  <img className='imagen-descargar' src={descarga} alt="descargar" />
                  Descargar Boleta
                </button>
              ) : (
                <button 
                  className="pagos-competidor-descargar disabled"
                  disabled
                >
                  <img className='imagen-descargar' src={descarga} alt="descargar" />
                  Boleta no disponible
                </button>
              )}
              <button 
                className="pagos-competidor-ver-detalle"
                onClick={() => handleVerDetalle(pago)}
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPDFModal && selectedPago && selectedPago.estado === 'Pagado' && (
        <div className="pdf-modal-overlay" onClick={handleCloseModal}>
          <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Vista previa del PDF</h3>
              <button className="pdf-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="pdf-modal-body">
              <PDFViewer style={{ width: '100%', height: '80vh' }}>
                <BoletaPagoPDF
                  boleta={selectedPago.codigo_boleta}
                  nombre={selectedPago.nombre || ''}
                  ci={selectedPago.ci || ''}
                  control={selectedPago.control}
                  area={selectedPago.area}
                  fechaEmision={selectedPago.fecha}
                  estado={selectedPago.estado}
                  monto={parseFloat(selectedPago.monto.replace('Bs. ', ''))}
                />
              </PDFViewer>
            </div>
            <div className="pdf-modal-footer">
              <PDFDownloadLink
                document={
                  <BoletaPagoPDF
                    boleta={selectedPago.boleta}
                    nombre={selectedPago.nombre || ''}
                    ci={selectedPago.ci || ''}
                    area={selectedPago.area}
                    fechaEmision={selectedPago.fecha}
                    estado={selectedPago.estado}
                    monto={parseFloat(selectedPago.monto.replace('Bs. ', ''))}
                  />
                }
                fileName={`boleta_${selectedPago.boleta}.pdf`}
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

export default PagosCompetidor; 