import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InicioCajero.css';
import axios from 'axios';

const InicioCajero = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    pagados: 0,
    cancelados: 0
  });
  const [pagosRealizados, setPagosRealizados] = useState([]);
  const [pagosPendientes, setPagosPendientes] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const [statsResponse, pagosRealizadosResponse, pagosPendientesResponse] = await Promise.all([
          axios.get('http://localhost:7777/api/pagos/estadisticas', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:7777/api/pagos/realizados', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:7777/api/pagos/pendientes', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setStats({
          total: statsResponse.data.totalPagos,
          pendientes: statsResponse.data.pagosPendientes,
          pagados: statsResponse.data.pagosValidados,
          cancelados: 0 // Si necesitas este dato, deberás agregarlo en el backend
        });

        setPagosRealizados(pagosRealizadosResponse.data);
        setPagosPendientes(pagosPendientesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return <div className="inicio-cajero-wrapper">Cargando datos...</div>;
  }

  if (error) {
    return <div className="inicio-cajero-wrapper">{error}</div>;
  }

  return (
    <div className="inicio-cajero-wrapper">
      <h2 className="inicio-cajero-titulo">Panel de Caja</h2>

      <div className="inicio-cajero-content">
        <div className="inicio-cajero-cards">
          <div className="inicio-cajero-card">
            <p className="inicio-cajero-label">Total Boletas</p>
            <p className="inicio-cajero-valor">{stats.total}</p>
          </div>
          <div className="inicio-cajero-card pendiente">
            <p className="inicio-cajero-label">Pendientes</p>
            <p className="inicio-cajero-valor">{stats.pendientes}</p>
          </div>
          <div className="inicio-cajero-card pagado">
            <p className="inicio-cajero-label">Pagadas</p>
            <p className="inicio-cajero-valor">{stats.pagados}</p>
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
              {pagosRealizados.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.codigo_pago}</td>
                  <td>{`${pago.inscripcion.competidor.usuario.nombre} ${pago.inscripcion.competidor.usuario.apellido}`}</td>
                  <td>{pago.inscripcion.competidor.carnet_identidad}</td>
                  <td>Bs. {pago.monto}</td>
                  <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inicio-cajero-boton-contenedor">
            <button 
              className="inicio-cajero-btn" 
              onClick={() => navigate('/pagos?estado=Pagado')}
            >
              Ver todos los pagos realizados
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
              {pagosPendientes.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.codigo_pago}</td>
                  <td>{`${pago.inscripcion.competidor.usuario.nombre} ${pago.inscripcion.competidor.usuario.apellido}`}</td>
                  <td>{pago.inscripcion.competidor.carnet_identidad}</td>
                  <td>Bs. {pago.monto}</td>
                  <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inicio-cajero-boton-contenedor">
            <button 
              className="inicio-cajero-btn" 
              onClick={() => navigate('/pagos?estado=Pendiente')}
            >
              Ver todos los pagos pendientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioCajero;
