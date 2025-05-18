import React, { useState } from 'react';

const mapNombreAGradoNumero = {
  'Primero': '1º',
  'Segundo': '2º',
  'Tercero': '3º',
  'Cuarto': '4º',
  'Quinto': '5º',
  'Sexto': '6º',
};

const ordenPrimaria = ['Tercero', 'Cuarto', 'Quinto', 'Sexto'];
const ordenSecundaria = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'];

/**
 * Componente para seleccionar grados escolares
 */
const GradosSelector = ({ grados, gradosSeleccionados, toggleGrado, error }) => {
  // Buscar los grados por nombre y nivel, si no existen, crear un objeto dummy para mostrar igual
  const primaria = ordenPrimaria.map(nombre => {
    const grado = grados.find(
      g => g.nivel.nombre_nivel.toLowerCase() === 'primaria' && g.nombre_grado === nombre
    );
    return grado || { id: `primaria-${nombre}`, nombre_grado: nombre, nivel: { nombre_nivel: 'Primaria' }, dummy: true };
  });
  const secundaria = ordenSecundaria.map(nombre => {
    const grado = grados.find(
      g => g.nivel.nombre_nivel.toLowerCase() === 'secundaria' && g.nombre_grado === nombre
    );
    return grado || { id: `secundaria-${nombre}`, nombre_grado: nombre, nivel: { nombre_nivel: 'Secundaria' }, dummy: true };
  });

  // Función para manejar el click y loguear solo cuando se marca/desmarca
  const handleGradoClick = (grado) => {
    if (!grado.dummy) {
      toggleGrado(grado.id);
      // El log real de los seleccionados se hace en el hook, pero aquí lo forzamos a loguear después de un pequeño delay para reflejar el nuevo estado
      setTimeout(() => {
        const seleccionados = document.querySelectorAll('.grado.seleccionado');
        const seleccionadosArr = Array.from(seleccionados).map(btn => btn.textContent.replace('grado', '').trim());
        console.log('Grados seleccionados (texto):', seleccionadosArr);
      }, 0);
    }
  };

  return (
    <>
      <label>
        Grados Permitidos <span className="obligatorio">*</span>
      </label>
      
      <p><strong>Primaria</strong></p>
      <div className="grid-grados">
        {primaria.map(grado => (
          <button
            type="button"
            key={grado.id}
            className={`grado ${gradosSeleccionados.some(g => g.id === grado.id) ? 'seleccionado' : ''} ${grado.dummy ? 'grado-dummy' : ''}`}
            onClick={() => handleGradoClick(grado)}
            disabled={grado.dummy}
            tabIndex={grado.dummy ? -1 : 0}
          >
            <div>{mapNombreAGradoNumero[grado.nombre_grado]}</div>
            <div style={{fontSize: '12px'}} >grado</div>
          </button>
        ))}
      </div>

      <p><strong>Secundaria</strong></p>
      <div className="grid-grados">
        {secundaria.map(grado => (
          <button
            type="button"
            key={grado.id}
            className={`grado ${gradosSeleccionados.some(g => g.id === grado.id) ? 'seleccionado' : ''} ${grado.dummy ? 'grado-dummy' : ''}`}
            onClick={() => handleGradoClick(grado)}
            disabled={grado.dummy}
            tabIndex={grado.dummy ? -1 : 0}
          >
            <div>{mapNombreAGradoNumero[grado.nombre_grado]}</div>
            <div style={{fontSize: '12px'}} >grado</div>
          </button>
        ))}
      </div>
      
      {error && <span className="error-text">{error}</span>}
    </>
  );
};

export default GradosSelector;