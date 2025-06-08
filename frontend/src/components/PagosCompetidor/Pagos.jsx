import React, { useEffect, useState, useCallback, useMemo } from 'react';
import '../../styles/PagosCompetidor/Pagos.css';
import { useNavigate } from 'react-router-dom';
import imagenDeiR from '../../image/imagenDeiR.svg';
import descarga from '../../image/descarga.svg';
import BoletaPagoPDF from '../PagosCompetidor/BoletaPagoPDF.jsx';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { verMisPagosPendientes } from '../../services/pagoService.js'; // Ajusta la ruta según tu estructura
import { io } from 'socket.io-client';

const PagosVistaCompetidor = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // Función para transformar los datos del servicio al formato esperado por el componente
  const transformarPagos = useCallback((pagosData) => {
    return pagosData.map(pago => ({
      id: pago.id,
      codigo_boleta: pago.codigo_pago,
      
      area: pago.inscripcion?.area?.nombre_area || 'N/A',
      monto: `Bs. ${pago.monto}`,
      fecha: new Date(pago.fecha_pago).toLocaleDateString('es-ES'),
      estado: pago.estado,
      // Datos adicionales para el PDF
      nombre: pago.inscripcion?.competidor?.usuario ? 
        `${pago.inscripcion.competidor.usuario.nombre} ${pago.inscripcion.competidor.usuario.apellido}` : 'N/A',
      ci: pago.inscripcion?.competidor?.carnet_identidad || 'N/A',
      correo: pago.inscripcion?.competidor?.usuario?.correo_electronico || 'N/A',
      //control: pago.codigo_pago // Usando el mismo código de pago como control

    }));
  }, []);
  const verDetallePago = useCallback((pago) => {
    navigate(`/pagos/detalle/${pago.codigo_boleta}`, { state: { pago } });
  }, [navigate]);

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

  const cargarPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await verMisPagosPendientes();
      const pagosTransformados = transformarPagos(data);
      setPagos(pagosTransformados);
      
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else {
          setError(`Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
        }
      } else if (error.code === 'ERR_NETWORK') {
        setError('No se pudo conectar con el servidor. Por favor, verifique su conexión.');
      } else {
        setError('Error al cargar los pagos. Por favor, intente nuevamente.');
      }
      setPagos([]);
    } finally {
      setLoading(false);
    }
  }, [transformarPagos]);

  useEffect(() => {
    cargarPagos();

    // Socket para actualizaciones en tiempo real
    const token = localStorage.getItem('token');
    if (token) {
      const socket = io('http://localhost:7777', {
        auth: { token }
      });

      try {
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
      } catch (err) {
        console.error('Error procesando token:', err);
      }

      return () => {
        socket.disconnect();
      };
    }
  }, [cargarPagos]);

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
        <td>{pago.codigo_boleta}</td>
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
    return (
      <div className="pagoscomp-container-principal">
        <div className="error-message">
          {error}
          <button onClick={cargarPagos} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
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

        <div className="pagos-info">
          <p>Total de pagos: {pagos.length}</p>
          <button onClick={cargarPagos} className="refresh-button">
            Actualizar
          </button>
        </div>

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
                  
                  boleta={selectedPago.codigo_boleta}
                  nombre={selectedPago.nombre}
                  control={selectedPago.codigo_boleta}
                  
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
                    boleta={selectedPago.codigo_boleta}
                    nombre={selectedPago.nombre}
                    ci={selectedPago.ci}
                    control={selectedPago.control} 
                    area={selectedPago.area}
                    fechaEmision={selectedPago.fecha}
                    estado={selectedPago.estado}
                    monto={parseFloat(selectedPago.monto.replace('Bs. ', ''))}
                  />
                }
                fileName={`boleta_${selectedPago.codigo_boleta}.pdf`}
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