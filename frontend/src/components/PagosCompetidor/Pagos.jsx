import React from 'react';
import '../../styles/PagosCompetidor/Pagos.css';
import { useNavigate } from 'react-router-dom';
import imagenDeiR from '../../image/imagenDeiR.svg';
import descarga from '../../image/descarga.svg';
import BoletaPagoPDF from '../PagosCompetidor/BoletaPagoPDF.jsx';
import { PDFDownloadLink } from '@react-pdf/renderer';

const PagosVistaCompetidor = () => {
  const pagos = [
    {
      boleta: 'BOL-2025-001',
      area: 'Matemática',
      monto: 'Bs. 15.00',
      fecha: '1 de abril de 2025',
      estado: 'Pendiente',
    },
  ];
  const navigate = useNavigate();

  const verDetallePago = (boleta) => {
    navigate(`/pagos/detalle/${boleta}`)
  };

  const descargarBoletaPago = (boleta) => {
    alert(`Descargando boleta: ${boleta}`);
  };

  return (
    <div className="pagoscomp-container-principal">
      <h2 className="pagoscomp-titulo-seccion">Mis pagos</h2>

      <div className="pagoscomp-tarjeta-listado">
        <h3 className="pagoscomp-subtitulo-tabla">Boletas de pago</h3>

        <table className="pagoscomp-tabla-pagos">
          <thead>
            <tr>
              <th>BOLETA</th>
              <th>ÁREA</th>
              <th>MONTO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, index) => (
              <tr key={index}>
                <td>{pago.boleta}</td>
                <td>{pago.area}</td>
                <td>{pago.monto}</td>
                <td>{pago.fecha}</td>
                <td>
                  <span className={`estado-pago ${pago.estado.toLowerCase()}`}>{pago.estado}</span>
                </td>
                <td className="pagoscomp-columna-acciones">
                  <button
                    className="pagoscomp-boton-ver"
                    onClick={() => verDetallePago(pago.boleta)}
                  >
                    <img className='imagen-ver-descargar' src={imagenDeiR} alt="ver"/>
                    Ver
                  </button>
                  <PDFDownloadLink
                    document={
                      <BoletaPagoPDF
                        boleta={pago.boleta}
                        nombre="Luis Flores" // Puedes reemplazar con props reales
                        ci="9389739"
                        area={pago.area}
                        fechaEmision="2025-04-01"
                        estado={pago.estado}
                        monto={15.00}
                      />
                    }
                    fileName={`boleta_${pago.boleta}.pdf`}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <button className="pagoscomp-boton-descargar">
                        <img className='imagen-ver-descargar' src={descarga} alt="descargar"/>
                        {loading ? 'Generando...' : 'Descargar'}
                      </button>
                    )}
                  </PDFDownloadLink>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PagosVistaCompetidor;
