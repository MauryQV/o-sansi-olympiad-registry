import React, { useEffect, useState } from 'react';
import '../styles/HistorialConvocatorias.css';
import { CalendarDays, FileWarning } from 'lucide-react';

const HistorialConvocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const datosFicticios = [
      {
        anio: 2025,
        estado: 'Abierto',
        inicio: '2025-04-05',
        cierre: '2025-05-20',
        color: '#3D7EFF',
        nombre: 'Olimpiadas Científicas Escolares 2025'
      },
      {
        anio: 2024,
        estado: 'Finalizado',
        inicio: '2024-02-10',
        cierre: '2024-03-25',
        color: '#5E5E69',
        nombre: 'Olimpiadas Científicas Escolares 2024'
      },
      {
        anio: 2023,
        estado: 'Finalizado',
        inicio: '2023-03-13',
        cierre: '2023-04-30',
        color: '#5E5E69',
        nombre: 'Olimpiadas Científicas Escolares 2023'
      }
    ];
    setConvocatorias(datosFicticios);
    setLoading(false);
  }, []);

  return (
    <div className="historial-wrapper">
      <div className="historial-contenedor">
        <h1 className="historial-titulo">Convocatorias</h1>
        <p className="historial-subtitulo">
          Historial de convocatorias para las olimpiadas científicas estudiantiles.
        </p>

        {loading ? (
          <p className="historial-cargando">Cargando convocatorias...</p>
        ) : (
          convocatorias.map((conv, index) => (
            <div className="historial-card" key={index}>
              <div className="historial-barra-anio" style={{ backgroundColor: conv.color }}>
                <span>{conv.anio}</span>
              </div>
              <div className="historial-card-contenido">
                <h2 className="historial-nombre">{conv.nombre}</h2>
                <div className="historial-fechas">
                  <span className="historial-fecha historial-inicio">
                    <CalendarDays size={16} className="historial-icono" />
                    Inicio: {formatearFecha(conv.inicio)}
                  </span>
                  <span className="historial-fecha historial-cierre">
                    <FileWarning size={16} className="historial-icono" />
                    Cierre: {formatearFecha(conv.cierre)}
                  </span>
                </div>
              </div>
              <div className={`historial-estado ${conv.estado.toLowerCase()}`}>{conv.estado}</div>
            </div>
          ))
        )}
      </div>

      <footer className="historial-footer">
        <div className="historial-footer-info">
          <p><strong>Contáctanos:</strong></p>
          <p>olimpiadacientifica@min.edu.bo</p>
          <p>Whatsapp: (+591)71530671 - (+591)78864958</p>
          <p>Teléfonos: 4231765-4215387</p>
          <p>Facultad de Ciencias y Tecnología (UMSS) - Calle Sucre y parque la Torre, Cochabamba</p>
        </div>
        <div className="historial-footer-logo">
          <p><strong>Olimpiadas Científicas Escolares</strong></p>
          <img src="/img/footer-icons.png" alt="iconos footer" className="historial-footer-icons" />
        </div>
      </footer>
    </div>
  );
};

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anio}`;
};

export default HistorialConvocatorias;
