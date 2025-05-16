import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoUMSS from '../../image/sansimon-f-BLAN.png'; 
import { boletaStyles as styles } from '../../styles/PagosCompetidor/boletaPagoStyles';

const numeroALiteral = (monto) => {
  if (monto === 16.00) return 'DIECISÉIS 00/100 BOLIVIANOS';
  if (monto === 15.00) return 'QUINCE 00/100 BOLIVIANOS';
  return `${monto.toFixed(2)} BOLIVIANOS`;
};


const BoletaPagoPDF = ({
  boleta,
  nombre,
  ci,
  area,
  fechaEmision,
  estado,
  monto,
  control = '17569',
  metodo = 'Electrónico',
  concepto = 'OLIMPIADA EN CIENCIAS SAN SIMON O! SANSI',
  comision = 1.00,
  horaEmision
}) => {
  const total = monto + comision;


  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.content}>

          {/* Encabezado con logo */}
          <View style={styles.header}>
            <Image src={logoUMSS} style={styles.logo} />
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerLine}>UNIVERSIDAD MAYOR DE SAN SIMÓN</Text>
              <Text style={styles.headerLine}>DIRECCIÓN ADMINISTRATIVA Y FINANCIERA</Text>
            </View>
          </View>

          <Text style={styles.title}>BOLETA DE PAGO</Text>

          <View style={styles.infoTableRight}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nro. Control:</Text>
              <Text>{control}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha:</Text>
              <Text>{fechaEmision} {horaEmision}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Método de pago:</Text>
              <Text>{metodo}</Text>
            </View>
          </View>


          {/* Datos personales */}
          <View style={styles.section}>
            <Text><Text style={styles.label}>Nombre:</Text> {nombre}</Text>
            <Text><Text style={styles.label}>CI:</Text> {ci}</Text>
          </View>

          {/* Concepto */}
          <View style={styles.conceptoMontoContainer}>
            {/* Columna izquierda: concepto */}
            <View style={styles.conceptoCol}>
              <Text style={styles.label}>Concepto de:</Text>
              <Text>{concepto}</Text>
              <Text>PAGO ELECTRÓNICO</Text>
            </View>

            {/* Columna derecha: montos */}
            <View style={styles.montoCol}>
              <Text style={styles.montoRight}>{monto.toFixed(2)}</Text>
              <Text style={styles.montoRight}>{comision.toFixed(2)}</Text>
              <View style={styles.montoLine} />
              <Text style={styles.total}>Total: Bs {total.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.literal}>
            La suma de: {numeroALiteral(total)}
          </Text>
          <Text style={styles.aclaracion}>
            Aclaración: {concepto}-bio
          </Text>

        </View>
      </Page>
    </Document>
  );
};

export default BoletaPagoPDF;

