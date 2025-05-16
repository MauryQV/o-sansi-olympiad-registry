import React from 'react';
import EstadoBadge from './EstadoBadge';
import '../../styles/Convocatorias/ModalVisualizarConvocatoria.css';

const ModalVisualizarConvocatoria = ({ visible, convocatoria, cerrar }) => {
  if (!visible || !convocatoria) return null;
  
  return (
    <div className="visual-modal-overlay">
      <div className="visual-modal-container">
        <div className="visual-modal-header">
          <h3 className="visual-modal-titulo">{convocatoria.nombre_convocatoria}</h3>
          <EstadoBadge estado={convocatoria.estado} />
        </div>
        
        <div className="visual-modal-seccion">
          <label className="visual-modal-label">Descripción</label>
          <p className="visual-modal-texto" style={{ whiteSpace: 'pre-line' }}>
            {convocatoria.descripcion_convocatoria}
          </p>
        </div>
        
        <div className="visual-modal-periodos">
          <div>
            <label className="visual-modal-label">Periodo de inscripción</label>
            <p>
              {convocatoria.fecha_inicio.split('T')[0].split('-').reverse().join('/')} - 
              {convocatoria.fecha_fin.split('T')[0].split('-').reverse().join('/')}
            </p>
          </div>
          <div>
            <label className="visual-modal-label">Periodo de pago</label>
            <p>
              {convocatoria.pago_inicio.split('T')[0].split('-').reverse().join('/')} - 
              {convocatoria.pago_fin.split('T')[0].split('-').reverse().join('/')}
            </p>
          </div>
          <div>
            <label className="visual-modal-label">Periodo de competencia</label>
            <p>
              {convocatoria.competicion_inicio.split('T')[0].split('-').reverse().join('/')} - 
              {convocatoria.competicion_fin.split('T')[0].split('-').reverse().join('/')}
            </p>
          </div>
        </div>
        
        <div className="visual-modal-seccion">
          <label className="visual-modal-label">Áreas de competencia</label>
          <div className="visual-modal-areas">
            {(convocatoria.areas || []).map((area, index) => (
              <span key={index} className="visual-area-tag">{area}</span>
            ))}
          </div>
        </div>
        
        <div className="visual-modal-footer">
          <button className="visual-modal-cerrar-btn" onClick={cerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalVisualizarConvocatoria;