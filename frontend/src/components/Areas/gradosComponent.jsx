import React from 'react';

/**
 * Componente para seleccionar grados escolares
 */
const GradosSelector = ({ grados, gradosSeleccionados, toggleGrado, error }) => {
  // Separar grados por nivel
  const primaria = grados.filter(g => g.nivel.nombre_nivel === 'Primaria');
  const secundaria = grados.filter(g => g.nivel.nombre_nivel === 'Secundaria');
  
  return (
    <>
      <label>
        Grados Permitidos <span className="obligatorio">*</span>
      </label>
      
      <p><strong>Primaria</strong></p>
      <div className="grid-grados">
        {primaria.map(grado => (
          <div
            key={grado.id}
            className={`grado ${gradosSeleccionados.includes(grado.id) ? 'seleccionado' : ''}`}
            onClick={() => toggleGrado(grado.id)}
          >
            {grado.nombre_grado} grado
          </div>
        ))}
      </div>

      <p><strong>Secundaria</strong></p>
      <div className="grid-grados">
        {secundaria.map(grado => (
          <div
            key={grado.id}
            className={`grado ${gradosSeleccionados.includes(grado.id) ? 'seleccionado' : ''}`}
            onClick={() => toggleGrado(grado.id)}
          >
            {grado.nombre_grado} grado
          </div>
        ))}
      </div>
      
      {error && <span className="error-text">{error}</span>}
    </>
  );
};

export default GradosSelector;