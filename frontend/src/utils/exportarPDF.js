import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportarPDF = (datos, currentPage = 1, nombreUsuario = 'Administrador') => {
  try {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString('es-BO');

    
    const titulo = datos.length > 20
      ? 'Reporte de Inscripciones (Todos los datos)'
      : 'Reporte de Inscripciones';

    doc.setFontSize(18);
    doc.text(titulo, 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generado por: ${nombreUsuario}`, 14, 30);
    doc.text(`Fecha: ${fechaActual}`, 14, 36);

    const filas = datos.map(i => [
      i.id,
      i.estudiante,
      i.area,
      i.categoria,
      i.grado,
      i.fecha,
      i.estado
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['ID', 'Estudiante', 'Área', 'Categoría', 'Grado', 'Fecha', 'Estado']],
      body: filas,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 150, 243] }
    });

    const nombreArchivo = datos.length > 20
      ? 'reporte_completo.pdf'
      : `reporte_pagina_${currentPage}.pdf`;

    doc.save(nombreArchivo);
  } catch (err) {
    console.error('Error al exportar PDF:', err);
    alert('No se pudo generar el PDF.');
  }
};
