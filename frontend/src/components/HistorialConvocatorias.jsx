import React, { useEffect, useState } from 'react';
import '../styles/HistorialConvocatorias.css';
import { CalendarDays, FileWarning } from 'lucide-react';


const HistorialConvocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // datos de   prueba 
    setTimeout(() => {
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
    }, 1000);

  
  }, []);

  return (
    <>
      <div className="historial-container">
        <h1 className="titulo">Convocatorias</h1>
        <p className="subtitulo">
          Historial de convocatorias para las olimpiadas científicas estudiantiles.
        </p>

        {loading ? (
          <p className="loading-text">Cargando convocatorias...</p>
        ) : (
          convocatorias.map((conv, index) => (
            <div className="card-convocatoria" key={index}>
              <div className="barra-anio" style={{ backgroundColor: conv.color }}>
                <span>{conv.anio}</span>
              </div>
              <div className="contenido">
                <h2 className="nombre">{conv.nombre}</h2>
                <div className="fechas">
                  <span className="fecha inicio">
                    <CalendarDays size={16} className="icono" />
                    Inicio: {formatearFecha(conv.inicio)}
                  </span>
                  <span className="fecha cierre">
                    <FileWarning size={16} className="icono" />
                    Cierre: {formatearFecha(conv.cierre)}
                  </span>
                </div>
              </div>
              <div className={`estado ${conv.estado.toLowerCase()}`}>{conv.estado}</div>
            </div>
          ))
        )}
      </div>

      <footer className="footer">
        <div className="footer-info">
          <p><strong>Contáctanos:</strong></p>
          <p>olimpiadacientifica@min.edu.bo</p>
          <p>Whatsapp: (+591)71530671 - (+591)78864958</p>
          <p>Teléfonos: 4231765-4215387</p>
          <p>Facultad de Ciencias y Tecnología (UMSS) - Calle Sucre y parque la Torre, Cochabamba</p>
        </div>
        <div className="footer-logo">
          <p><strong>Olimpiadas Científicas Escolares</strong></p>
          <img src="/img/footer-icons.png" alt="iconos footer" className="footer-icons" />
        </div>
      </footer>
    </>
  );
};

// Función para formatear fecha tipo YYYY-MM-DD -> DD/MM/YYYY
const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anio}`;
};

export default HistorialConvocatorias;