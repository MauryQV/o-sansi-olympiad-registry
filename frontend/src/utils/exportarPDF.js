import jsPDF from 'jspdf';
import 'jspdf-autotable';
//para exportar pdf  en reportes
export const exportarPDF = (datosPagina, currentPage, nombreUsuario = 'Administrador General') => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString('es-BO');

  doc.setFontSize(18);
  doc.text('Reporte de Inscripciones (Página actual)', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Generado por: ${nombreUsuario}`, 14, 30);
  doc.text(`Fecha: ${fechaActual}`, 14, 36);

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
};
