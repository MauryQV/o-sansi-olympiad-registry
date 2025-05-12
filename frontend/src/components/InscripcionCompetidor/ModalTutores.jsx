import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import '../../styles/InscripcionCompetidor/ModalTutores.css';
import { esTextoValido } from '../../forms/formularioInscripcionValidator';
import { obtenerTutores } from '../../services/competidorInscripcion';

const ModalTutores = ({ areaSeleccionada, onClose, onSelect }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async () => {
    if (!areaSeleccionada || !esTextoValido(busqueda)) return;

    setLoading(true);
    setError(null);

    try {
      const data = await obtenerTutores(areaSeleccionada, busqueda);
      setResultados(data);
    } catch (err) {
      setError('Error al buscar tutores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-tutores-overlay">
      <div className="modal-tutores">
        <div className="modal-tutores-header">
          <span className="modal-tutores-icono-buscar"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Buscar tutores..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
          <button className="modal-tutores-boton-cerrar" onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="modal-tutores-subtitulo">Tutores disponibles</p>

        <div className="modal-tutores-lista">
          {loading && <p className="modal-tutores-cargando">Cargando...</p>}
          {error && <p className="modal-tutores-error">{error}</p>}

          {!loading && !error && resultados.length === 0 && (
            <p className="modal-tutores-vacio">Escriba un nombre y presione Enter</p>
          )}

          {resultados.map((tutor) => (
            <div
              key={tutor.id}
              className="modal-tutores-item"
              onClick={() => {
                onSelect(tutor); // ← Envía todo el objeto al padre
                onClose();
              }}
            >
              <span className="modal-tutores-texto">{tutor.nombre_completo}</span>
              <span className="modal-tutores-icono-agregar"><Plus size={14} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalTutores;
