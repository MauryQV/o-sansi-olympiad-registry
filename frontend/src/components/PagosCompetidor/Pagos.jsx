import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../../styles/PagosCompetidor/Pagos.css';
import { useNavigate } from 'react-router-dom';
import imagenDeiR from '../../image/imagenDeiR.svg';
import descarga from '../../image/descarga.svg';
import BoletaPagoPDF from '../PagosCompetidor/BoletaPagoPDF.jsx';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import { io } from 'socket.io-client';


const ITEMS_PER_PAGE = 10;

const PagosVistaCompetidor = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const verDetallePago = useCallback((pago) => {
    navigate(`/pagos/detalle/${pago.boleta}`, { state: { pago } });
  }, [navigate]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

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

  const cargarPagos = useCallback(async (page) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      const response = await axios({
        method: 'get',
        url: `http://localhost:7777/api/pagos/competidor?page=${page}&limit=${ITEMS_PER_PAGE}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data) {
        setPagos(response.data.pagos);
        setTotalPages(response.data.totalPages);
        setTotalPagos(response.data.total);
      } else {
        setPagos([]);
        setTotalPages(0);
        setTotalPagos(0);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else {
          setError(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'Error desconocido'}`);
        }
      } else if (error.code === 'ERR_NETWORK') {
        setError('No se pudo conectar con el servidor en el puerto 7777. Por favor, verifique que el servidor esté en ejecución.');
      } else {
        setError('Error al cargar los pagos. Por favor, intente nuevamente.');
      }
      setPagos([]);
      setTotalPages(0);
      setTotalPagos(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPagos(currentPage);

    const token = localStorage.getItem('token');
    const socket = io('http://localhost:7777', {
      auth: {
        token
      }
    });

    const userId = JSON.parse(atob(token.split('.')[1])).id;
    socket.emit('registrar_usuario', userId);

    socket.on('pago:actualizado', ({ pagoId, estado }) => {
      setPagos(pagosActuales => 
        pagosActuales.map(pago => 
          pago.id === pagoId 
            ? { ...pago, estado } 
            : pago
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [currentPage, cargarPagos]);

  const ActionButtons = useMemo(() => {
    return ({ pago }) => (
      <td className="pagoscomp-columna-acciones">
        <button
          className="pagoscomp-boton-ver"
          onClick={() => verDetallePago(pago)}
        >
          <img className='imagen-ver-descargar' src={imagenDeiR} alt="ver" loading="lazy"/>
          Ver
        </button>
        {pago.estado === 'Pagado' && (
          <button
            className="pagoscomp-boton-descargar"
            onClick={() => handleDownloadClick(pago)}
          >
            <img className='imagen-ver-descargar' src={descarga} alt="descargar" loading="lazy"/>
            Descargar
          </button>
        )}
      </td>
    );
  }, [verDetallePago, handleDownloadClick]);

  const tableRows = useMemo(() => {
    if (pagos.length === 0) {
      return (
        <tr>
          <td colSpan="6">No tienes pagos registrados.</td>
        </tr>
      );
    }

    return pagos.map((pago) => (
      <tr key={pago.id}>
        <td>{pago.boleta}</td>
        <td>{pago.area}</td>
        <td>{pago.monto}</td>
        <td>{pago.fecha}</td>
        <td>
          <span className={`estado-pago ${pago.estado.toLowerCase()}`}>
            {pago.estado}
          </span>
        </td>
        <ActionButtons pago={pago} />
      </tr>
    ));
  }, [pagos, ActionButtons]);

  if (loading) {
    return <div className="pagoscomp-container-principal">Cargando pagos...</div>;
  }

  if (error) {
    return <div className="pagoscomp-container-principal">{error}</div>;
  }

  return (
    <div className="pagoscomp-container-principal">
      <h2 className="pagoscomp-titulo-seccion">Mis pagos</h2>

      <div className="pagoscomp-tarjeta-listado">
        <h3 className="pagoscomp-subtitulo-tabla">Boletas de pago</h3>
        <p className="pagoscomp-mensaje-advertencia">
          Solo se permiten realizar los pagos mientras estés en el periodo de pagos
        </p>

        {showAlert && (
          <div className="alert-message">
            Solo puedes descargar la boleta cuando el pago esté pagado
          </div>
        )}

        <table className="pagoscomp-tabla-pagos">
          <thead>
            <tr>
              <th>BOLETA</th>
              <th>ÁREA</th>
              <th>MONTO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Anterior
            </button>
            <span className="pagination-info">
              Página {currentPage} de {totalPages} ({totalPagos} pagos)
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {showPDFModal && selectedPago && (
        <div className="pdf-modal-overlay" onClick={handleCloseModal}>
          <div className="pdf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Vista previa del PDF</h3>
              <button className="pdf-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="pdf-modal-body">
              <PDFViewer style={{ width: '100%', height: '80vh' }}>
                <BoletaPagoPDF
                  boleta={selectedPago.boleta}
                  nombre={selectedPago.nombre}
                  ci={selectedPago.ci}
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
                    nombre={selectedPago.nombre}
                    ci={selectedPago.ci}
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

export default PagosVistaCompetidor;
