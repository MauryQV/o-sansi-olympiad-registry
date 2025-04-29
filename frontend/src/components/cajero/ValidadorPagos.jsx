import React, { useEffect, useState } from 'react';
import '../../styles/cajero/ValidadorPagos.css';
import { Search, RotateCcw, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { mostrarConfirmacionPago } from './ConfirmacionPagoModal';

const ValidadorPagos = () => {
  const [criterio, setCriterio] = useState('codigo');
  const [termino, setTermino] = useState('');
  const [boletas, setBoletas] = useState([]);
  const [boletasOriginal, setBoletasOriginal] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const datosSimulados = [
        {
          codigo: 'BOL-2024-001',
          competidor: 'Lidia Veizaga',
          ci: '4567890',
          monto: 15.0,
          fecha: '2025-04-01',
        },
        {
          codigo: 'BOL-2024-002',
          competidor: 'Juan Pérez',
          ci: '1234567',
          monto: 20.0,
          fecha: '2025-04-02',
        }
      ];
      setBoletas(datosSimulados);
      setBoletasOriginal(datosSimulados);
    }, 1000);
  }, []);

  const handleBuscar = () => {
    const t = termino.trim().toLowerCase();
    const filtradas = boletasOriginal.filter((b) => {
      if (criterio === 'codigo') return b.codigo.toLowerCase().includes(t);
      if (criterio === 'nombre') return b.competidor.toLowerCase().includes(t);
      if (criterio === 'ci') return b.ci.includes(t);
      return false;
    });
    setBoletas(filtradas);
  };

  const handleResetear = () => {
    setTermino('');
    setBoletas(boletasOriginal);
  };

  const confirmarValidacion = async (boleta) => {
    const confirmado = await mostrarConfirmacionPago(boleta);
    if (!confirmado) return;

    try {
      await fetch('/api/validar-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: boleta.codigo })
      });

      const actualizadas = boletas.filter(b => b.codigo !== boleta.codigo);
      setBoletas(actualizadas);
      setBoletasOriginal(actualizadas);

      Swal.fire({
        icon: 'success',
        title: '¡Pago Validado!',
        text: 'El pago fue registrado correctamente.',
        confirmButtonColor: '#4caf50'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo validar el pago. Intente nuevamente.',
        confirmButtonColor: '#e53935'
      });
    }
  };

  return (
    <div className="validador-container">
      <h2>Validar Pagos</h2>

      <div className="validador-busqueda">
        <h3>Buscar Boletas</h3>
        <div className="validador-formulario">
          <div>
            <label>Buscar por</label>
            <select value={criterio} onChange={(e) => setCriterio(e.target.value)}>
              <option value="codigo">Código de boleta</option>
              <option value="nombre">Nombre del competidor</option>
              <option value="ci">Carnet de identidad</option>
            </select>
          </div>

          <div>
            <label>Término de búsqueda</label>
            <input
              type="text"
              placeholder="Ej: BOL-2025-001"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
            />
          </div>

          <button className="btn-buscar" onClick={handleBuscar}>
            <Search size={16} /> Buscar
          </button>

          <button className="btn-resetear" onClick={handleResetear}>
            <RotateCcw size={16} /> Resetear
          </button>
        </div>
      </div>

      <div className="validador-tabla">
        <h3>Boletas Pendientes</h3>
        {!error && boletas.length > 0 && (
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
                    <button className="btn-validar" onClick={() => confirmarValidacion(b)}>
                      Validar Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!error && boletas.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            No se encontraron resultados.
          </p>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ValidadorPagos;
