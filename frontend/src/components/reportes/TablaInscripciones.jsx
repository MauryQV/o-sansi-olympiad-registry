import React from 'react';

const TablaInscripciones = ({ datosPagina }) => (
  <>
    <table className="reportes-minimal__tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Estudiante</th>
          <th>Área</th>
          <th>Categoría</th>
          <th>Grado</th>
          <th>Fecha de Inscripción</th>
          <th>Estado</th>
          <th>Motivo</th> {/* Nueva columna */}
        </tr>
      </thead>
      <tbody>
        {datosPagina.map(i => (
          <tr key={i.id}>
            <td>{i.id}</td>
            <td>{i.estudiante}</td>
            <td>{i.area}</td>
            <td>{i.categoria}</td>
            <td>{i.grado}</td>
            <td>{i.fecha}</td>
            <td>
              <span className={`estado estado--${i.estado.toLowerCase()}`}>
                {i.estado}
              </span>
            </td>
            <td>
              {i.estado === 'Cancelado' ? (
                <span style={{ color: '#c00', fontSize: '0.95rem' }}>
                  {i.motivoCancelacion || 'Sin motivo especificado'}
                </span>
              ) : (
                '-'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="reportes-minimal__total">{datosPagina.length} resultados</p>
  </>
);

export default TablaInscripciones;
