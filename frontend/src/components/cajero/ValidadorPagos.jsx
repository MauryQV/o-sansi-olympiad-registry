import React from 'react';
import '../../styles/cajero/ValidadorPagos.css';
import { Search, RotateCcw } from 'lucide-react';
import TablaBoletas from './TablaBoletas';
import { useValidadorPagos } from '../../hooks/useValidadorPagos';
import { mostrarConfirmacionPago } from './ConfirmacionPagoModal';
const ValidadorPagos = () => {
  const {
    criterio, setCriterio,
    termino, setTermino,
    boletas, error,
    handleBuscar, handleResetear, confirmarValidacion,
    esTerminoValido
  } = useValidadorPagos();

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
              onChange={(e) => {
                const valor = e.target.value;
                if (esTerminoValido(valor)) {
                  setTermino(valor);
                }
              }}
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
        {!error ? (
          <TablaBoletas boletas={boletas} onConfirmar={confirmarValidacion} />
        ) : (
          <p style={{ color: 'red' }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default ValidadorPagos;
