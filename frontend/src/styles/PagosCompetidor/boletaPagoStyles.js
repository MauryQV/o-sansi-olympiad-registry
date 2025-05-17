import { StyleSheet } from '@react-pdf/renderer';

export const boletaStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, padding: 30 },
  content: { border: '1pt solid #000', borderRadius: 10, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 1, marginLeft: -10, marginTop: -10 },
  logo: { width: 45, height: 60, marginRight: 8, marginTop: -5 },
  headerTextGroup: { justifyContent: 'flex-start', paddingTop: 6, gap: 1 },
  headerLine: { fontSize: 8, fontWeight: 400 },
  titulo: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 2, marginBottom: 8 },
  infoTablaDer: { alignSelf: 'flex-end', gap: 1, marginBottom: 20, marginRight: 10, width: 130 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  section: { marginBottom: 10 },
  conceptoMontoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  conceptoCol: { width: '60%' },
  montoCol: { width: '35%', alignItems: 'flex-end' },
  montoRight: { textAlign: 'right', marginBottom: 2, marginRight: 10 },
  montoLine: { borderTop: '1pt dashed #000', marginTop: 2, marginBottom: 5, width: 80, alignSelf: 'flex-end' },
  total: { textAlign: 'right', fontSize: 8, marginRight: 10 },
  literal: { fontSize: 8, marginTop: 10 },
  aclaracion: { fontSize: 8, fontWeight: 'bold' },
});