import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoUMSS from '../../image/sansimon-f-BLAN.png'; 
import { boletaStyles as styles } from '../../styles/PagosCompetidor/boletaPagoStyles';
import {numeroALetras} from '../../utils/numeroALetras'; // Asegúrate de tener esta función utilitaria

const numeroALiteral = (monto) => {
  const entero = Math.floor(monto);
  const decimales = Math.round((monto - entero) * 100).toString().padStart(2, '0');
  return `${numeroALetras(entero).toUpperCase()} ${decimales}/100 BOLIVIANOS`;
};


const BoletaPagoPDF = ({
  boleta,
  nombre,
  ci,
  area,
  fechaEmision,
  estado,
  monto,
  control,
  metodo = 'CAJA',
  concepto = 'OLIMPIADA EN CIENCIAS SAN SIMON O! SANSI',
  comision = 1.00,
  horaEmision
}) => {
  const total = monto;


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

          <Text style={styles.titulo}>BOLETA DE PAGO</Text>

          <View style={styles.infoTablaDer}>

            <View style={styles.infoRow}>

              <Text style={styles.label}>Nro. Control:</Text>

              <Text>{ boleta}</Text>

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
              
            </View>

            {/* Columna derecha: montos */}
            <View style={styles.montoCol}>
              <Text style={styles.montoRight}>{monto.toFixed(2)}</Text>
           
              <View style={styles.montoLine} />
              <Text style={styles.total}>Total: Bs {monto.toFixed(2)}</Text>
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

