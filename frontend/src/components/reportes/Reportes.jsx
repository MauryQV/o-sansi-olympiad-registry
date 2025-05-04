import React from 'react';
import '../../styles/reportes/Reportes.css';
import { Download } from 'lucide-react';
import { useReporteInscripciones } from '../../hooks/useReporteInscripciones';
import FiltrosReporte from './FiltrosReporte';
import TablaInscripciones from './TablaInscripciones';
import { exportarPDF } from '../../utils/exportarPDF';

const Reportes = () => {
  const {
    estadoFiltro, setEstadoFiltro,
    areaFiltro, setAreaFiltro,
    areas, datosPagina, datosFiltrados,
    limpiar, currentPage, setCurrentPage, totalPages,
    aplicarFiltrosManual, filtrosAplicados
  } = useReporteInscripciones();

  const estados = ['Pendiente', 'Completado', 'Cancelado'];

  return (
    <div className="reportes-minimal">
      <div className="reportes-minimal__header">
        <h2>Reportes de Inscripciones</h2>
        <button className="reportes-minimal__btn-exportar" onClick={() => exportarPDF(datosFiltrados, currentPage)}>
          <Download size={16} style={{ marginRight: '6px' }} /> Exportar
        </button>
      </div>

      <FiltrosReporte
        estados={estados}
        areas={areas}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        areaFiltro={areaFiltro}
        setAreaFiltro={setAreaFiltro}
        limpiar={limpiar}
        onFiltrar={aplicarFiltrosManual}
      />

      {filtrosAplicados && <TablaInscripciones datosPagina={datosPagina} />}

      {filtrosAplicados && (
        <div className="reportes-minimal__paginacion">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'activo' : ''}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default Reportes;