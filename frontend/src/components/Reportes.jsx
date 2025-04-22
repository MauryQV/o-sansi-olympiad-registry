import React, { useState } from 'react';
import '../styles/Reportes.css';

const Reportes = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('');

  const inscripciones = [
    { id: 1, estudiante: 'John Smith', area: 'Robótica', categoria: 'Builders P', grado: '5to Primaria', fecha: '15/01/2025', estado: 'Pendiente' },
    { id: 2, estudiante: 'Sarah Johnson', area: 'Biología', categoria: '2S', grado: '2do Secundaria', fecha: '16/01/2025', estado: 'Completado' },
    { id: 3, estudiante: 'Michael Brown', area: 'Física', categoria: '6S', grado: '6to Secundaria', fecha: '17/01/2025', estado: 'Cancelado' },
    { id: 4, estudiante: 'Emma Davis', area: 'Química', categoria: '4S', grado: '4to Secundaria', fecha: '18/01/2025', estado: 'Completado' },
    { id: 5, estudiante: 'James Wilson', area: 'Robótica', categoria: 'Builders P', grado: '6to Primaria', fecha: '19/01/2025', estado: 'Pendiente' },
  ];

  const estados = ['Pendiente', 'Completado', 'Cancelado'];
  const areas = ['Robótica', 'Biología', 'Física', 'Química'];

  const filtrar = () => {
    return inscripciones.filter(i =>
      (estadoFiltro === '' || i.estado === estadoFiltro) &&
      (areaFiltro === '' || i.area === areaFiltro)
    );
  };

  const limpiar = () => {
    setEstadoFiltro('');
    setAreaFiltro('');
  };

  return (
    <div className="reportes-minimal">
      <div className="reportes-minimal__header">
        <h2>Reportes de Inscripciones</h2>
        <button className="reportes-minimal__btn-exportar">Exportar</button>
      </div>

      <div className="reportes-minimal__filtros">
        <div className="reportes-minimal__filtro">
          <label>Estado</label>
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            {estados.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="reportes-minimal__filtro">
          <label>Área</label>
          <select value={areaFiltro} onChange={e => setAreaFiltro(e.target.value)}>
            <option value="">Todas las áreas</option>
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="reportes-minimal__acciones">
          <button onClick={filtrar}>Filtrar</button>
          <button onClick={limpiar} className="secundario">Restablecer</button>
        </div>
      </div>

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
          </tr>
        </thead>
        <tbody>
          {filtrar().map(i => (
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
            </tr>
          ))}
        </tbody>
      </table>

      <p className="reportes-minimal__total">{filtrar().length} resultados</p>

      <div className="reportes-minimal__paginacion">
        <button>&lt;</button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
          <button key={p} className={p === 1 ? 'activo' : ''}>{p}</button>
        ))}
        <button>&gt;</button>
      </div>
    </div>
  );
};

export default Reportes;
