import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import '../../styles/InscripcionCompetidor/ModalTutores.css';
import { esTextoValido } from '../../forms/formularioInscripcionValidator';

const ModalTutores = ({ tutores, areaSeleccionada, onClose, onSelect }) => {
  const [busqueda, setBusqueda] = useState('');

  const handleChange = (e) => {
    const texto = e.target.value;
    if (esTextoValido(texto)) {
      setBusqueda(texto);
    }
  };

  // Solo filtra si hay texto válido escrito
  const tutoresFiltrados = busqueda.trim().length > 0
    ? tutores.filter(
        (t) =>
          t.area === areaSeleccionada &&
          t.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  return (
    <div className="modal-tutores-overlay">
      <div className="modal-tutores">
        <div className="modal-tutores-header">
          <span className="modal-tutores-icono-buscar"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Buscar tutores..."
            value={busqueda}
            onChange={handleChange}
          />
          <button className="modal-tutores-boton-cerrar" onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="modal-tutores-subtitulo">Tutores disponibles</p>

        <div className="modal-tutores-lista">
          {busqueda.trim().length > 0 ? (
            tutoresFiltrados.length > 0 ? (
              tutoresFiltrados.map((t, i) => (
                <div key={i} className="modal-tutores-item" onClick={() => { onSelect(t.nombre); onClose(); }}>
                  <span className="modal-tutores-texto">{t.nombre} - {t.correo}</span>
                  <span className="modal-tutores-icono-agregar"><Plus size={14} /></span>
                </div>
              ))
            ) : (
              <p className="modal-tutores-vacio">No se encontraron tutores.</p>
            )
          ) : (
            <p className="modal-tutores-vacio">Escriba para buscar tutores.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTutores;
