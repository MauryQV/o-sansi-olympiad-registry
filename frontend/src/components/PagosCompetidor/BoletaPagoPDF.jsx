import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 30,
    fontSize: 12,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
  }
});

const BoletaPagoPDF = ({ boleta, nombre, ci, area, fechaEmision, estado, monto }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Boleta de Pago</Text>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Boleta:</Text> {boleta}</Text>
        <Text><Text style={styles.label}>Estado:</Text> {estado}</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Nombre del Competidor:</Text> {nombre}</Text>
        <Text><Text style={styles.label}>CI:</Text> {ci}</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Área:</Text> {area}</Text>
        <Text><Text style={styles.label}>Fecha de Emisión:</Text> {fechaEmision}</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Monto:</Text> Bs. {monto.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default BoletaPagoPDF;
