import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const COLUMN_WIDTH = 80; // Ancho fijo para cada celda en puntos

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    width: COLUMN_WIDTH,
    textAlign: 'center'
  }
});

const ReportePDF = ({ datos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Reporte de Inscripciones</Text>

      <View style={styles.table}>
        {/* Encabezado */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>ID</Text>
          <Text style={styles.tableCell}>Estudiante</Text>
          <Text style={styles.tableCell}>Área</Text>
          <Text style={styles.tableCell}>Categoría</Text>
          <Text style={styles.tableCell}>Grado</Text>
          <Text style={styles.tableCell}>Fecha</Text>
          <Text style={styles.tableCell}>Estado</Text>
        </View>

        {/* Filas */}
        {datos.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.tableCell}>{item.id}</Text>
            <Text style={styles.tableCell}>{item.estudiante}</Text>
            <Text style={styles.tableCell}>{item.area}</Text>
            <Text style={styles.tableCell}>{item.categoria}</Text>
            <Text style={styles.tableCell}>{item.grado}</Text>
            <Text style={styles.tableCell}>{item.fecha}</Text>
            <Text style={styles.tableCell}>{item.estado}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportePDF;
