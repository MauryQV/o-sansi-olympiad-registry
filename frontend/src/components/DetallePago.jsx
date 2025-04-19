// src/components/DetallePago.jsx
import React, { useState } from 'react';
import '../styles/DetallePago.css';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';



const DetallePago = () => {
  const { boleta } = useParams();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState("caja");

  const volver = () => {
    navigate('/pagos-competidor');
    
  };

  return (
    <div className="detallepago-container">
      <div className="detallepago-header">
        <h2>Detalles de Pago</h2>
        <button className="detallepago-volver" onClick={volver}>Volver</button>
      </div>

      <div className="detallepago-tarjeta">
        <div className="detallepago-info">
          <div>
            <h3>Boleta de Pago: {boleta}</h3>
            <p className="detallepago-estado-texto">Pendiente de Pago</p>
            <p><strong>Competidor:</strong> Competidor Richard</p>
            <p><strong>CI:</strong> 9389739</p>
            <p className="detallepago-monto">Monto <span>Bs. 15.00</span></p>
          </div>
          <div>
            <p><strong>Área:</strong> Matemática</p>
            <p><strong>Emisión:</strong> 2025-03-01</p>
            <p><strong>Estado:</strong> <span className="detallepago-estado">Pendiente</span></p>
          </div>
        </div>
        <div className="detallepago-acciones">
          <button className="detallepago-descargar">⬇️ Descargar Boleta</button>
        </div>
      </div>

      <div className="detallepago-pago">
        <h3>Realizar Pago</h3>
        <p className="detallepago-sub">Seleccione su método de pago preferido</p>
        <div className="detallepago-metodos">
            <button
                className={metodoPago === "caja" ? "activo" : ""}
                onClick={() => setMetodoPago("caja")}
            >
                🏛️ Pago en Caja
            </button>
            <button
                className={metodoPago === "qr" ? "activo" : ""}
                onClick={() => setMetodoPago("qr")}
            >
                💳 Pago QR
            </button>
        </div>

        {metodoPago === "caja" ? (
        <div className="detallepago-instrucciones">
            <p><strong>Instrucciones para Pago en Caja</strong></p>
            <ol>
                <li>Acuda a la oficina de la institución en horario de atención (8:00 - 16:00).</li>
                <li>Presente su boleta Nº {boleta} en ventanilla.</li>
                <li>Realice el pago de Bs. 15.00.</li>
                <li>Conserve su recibo como comprobante de pago.</li>
            </ol>
        </div>
            
        ) : (
        <div className="detallepago-instrucciones">
            <div className="detallepago-qr-img">
             <QRCode value={`Boleta: ${boleta} - Monto: Bs. 15.00`} size={150} />
            </div>
            <p className="detallepago-qr-texto">Escanea este código QR para pagar Bs. 15.00</p>
            <button className="detallepago-btn-qr-confirmar">Pago QR</button>
            </div>
         )}
      </div>
    </div>
  );
};

export default DetallePago;
