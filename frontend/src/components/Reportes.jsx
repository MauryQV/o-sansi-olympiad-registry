import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de haber instalado esto
import '../styles/Reportes.css'; // Tus estilos personalizados
import { Download, RotateCcw } from 'lucide-react';



const Reportes = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simulación de carga de datos (reemplazar por fetch si es desde backend)
  useEffect(() => {
    const mockInscripciones = [
      { id: 1, estudiante: 'John Smith', area: 'Robótica', categoria: 'Builders P', grado: '5to Primaria', fecha: '15/01/2025', estado: 'Pendiente' },
      { id: 2, estudiante: 'Sarah Johnson', area: 'Biología', categoria: '2S', grado: '2do Secundaria', fecha: '16/01/2025', estado: 'Completado' },
      { id: 3, estudiante: 'Michael Brown', area: 'Física', categoria: '6S', grado: '6to Secundaria', fecha: '17/01/2025', estado: 'Cancelado' },
      { id: 4, estudiante: 'Emma Davis', area: 'Química', categoria: '4S', grado: '4to Secundaria', fecha: '18/01/2025', estado: 'Completado' },
      { id: 5, estudiante: 'James Wilson', area: 'Robótica', categoria: 'Builders P', grado: '6to Primaria', fecha: '19/01/2025', estado: 'Pendiente' },
      { id: 6, estudiante: 'Ana Torres', area: 'Física', categoria: '3S', grado: '3ro Secundaria', fecha: '20/01/2025', estado: 'Completado' },
    ];

    const mockAreas = [
      { id: 1, nombre: 'Robótica' },
      { id: 2, nombre: 'Biología' },
      { id: 3, nombre: 'Física' },
      { id: 4, nombre: 'Química' }
    ];

    setInscripciones(mockInscripciones);
    setAreas(mockAreas);
  }, []);

  const estados = ['Pendiente', 'Completado', 'Cancelado'];

  const filtrar = () => {
    return inscripciones.filter(i =>
      (estadoFiltro === '' || i.estado === estadoFiltro) &&
      (areaFiltro === '' || i.area === areaFiltro)
    );
  };

  useEffect(() => {
    setCurrentPage(1); // Reiniciar a página 1 al cambiar filtros
  }, [estadoFiltro, areaFiltro]);

  const limpiar = () => {
    setEstadoFiltro('');
    setAreaFiltro('');
  };

  const exportarPDF = () => {
    try {
      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString('es-BO');
      const nombreUsuario = 'Administrador General';

      doc.setFontSize(18);
      doc.text('Reporte de Inscripciones (Página actual)', 105, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Generado por: ${nombreUsuario}`, 14, 30);
      doc.text(`Fecha: ${fechaActual}`, 14, 36);

      const datosFiltrados = filtrar();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const datosPagina = datosFiltrados.slice(startIndex, endIndex);

      const filas = datosPagina.map(i => [
        i.id,
        i.estudiante,
        i.area,
        i.categoria,
        i.grado,
        i.fecha,
        i.estado
      ]);

      doc.autoTable({
        startY: 45,
        head: [['ID', 'Estudiante', 'Área', 'Categoría', 'Grado', 'Fecha', 'Estado']],
        body: filas,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [33, 150, 243] }
      });

      doc.save(`reporte_pagina_${currentPage}.pdf`);
    } catch (error) {
      console.error("❌ Error al exportar PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    }
  };

  const datosFiltrados = filtrar();
  const totalPages = Math.ceil(datosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const datosPagina = datosFiltrados.slice(startIndex, endIndex);

  return (
    <div className="reportes-minimal">
      <div className="reportes-minimal__header">
        <h2>Reportes de Inscripciones</h2>
        <button className="reportes-minimal__btn-exportar" onClick={exportarPDF}>
          <Download size={16} style={{ marginRight: '6px' }} /> Exportar
        </button>
      </div>

      <div className="reportes-minimal__filtros">
      <div style={{ width: '100%' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Filtros</h3>
      <p style={{ margin: '4px 0 16px', fontSize: '0.88rem', color: '#666' }}>
         Filtra las inscripciones por diferentes criterios
      </p>
     </div>

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
         {areas.map(a => <option key={a.id}>{a.nombre}</option>)}
       </select>
        </div>
         <div className="reportes-minimal__acciones">
        <button onClick={limpiar} className="secundario">
      <RotateCcw size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
      Restablecer
        </button>
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
            </tr>
          ))}
        </tbody>
      </table>

      <p className="reportes-minimal__total">{datosFiltrados.length} resultados</p>

      <div className="reportes-minimal__paginacion">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt;</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'activo' : ''}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>&gt;</button>
      </div>
    </div>
  );
};

export default Reportes;
