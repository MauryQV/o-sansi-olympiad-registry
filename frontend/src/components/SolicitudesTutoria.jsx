import React from 'react';
import Swal from 'sweetalert2';
import { X, Check } from 'lucide-react';
import '../styles/SolicitudesTutoria.css';
import { useSolicitudesTutoria } from '../hooks/solicitudesTutoria';

const SolicitudesTutoria = () => {
  const { solicitudes, setSolicitudes, loading, error } = useSolicitudesTutoria();

  const actualizarEstado = (id, nuevoEstado) => {
    setSolicitudes(prev =>
      prev.map(s =>
        s.id === id ? { ...s, estado: nuevoEstado } : s
      )
    );

    Swal.fire({
      icon: nuevoEstado === 'Aceptada' ? 'success' : 'error',
      title: `Solicitud ${nuevoEstado === 'Aceptada' ? 'aceptada' : 'rechazada'}`,
      text: `Has ${nuevoEstado === 'Aceptada' ? 'validado' : 'rechazado'} la solicitud del competidor.`,
      confirmButtonColor: nuevoEstado === 'Aceptada' ? '#3085d6' : '#d33',
    });
  };

  return (
    <div className="solicitudes-tutoria-container">
      <h2>Solicitudes de Tutoría</h2>
      <p className="descripcion-subtitulo">Gestione las solicitudes de tutoría de los competidores</p>

     {!loading && solicitudes.length === 0 && (
  <div className="mensaje-vacio">
    <p> NO HAY SOLICITUDESSSSSSSSSSSSSSS</p>
    <p>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
  </div>
)}
      {error && <p className="error">Error: {error}</p>}

      {!loading && solicitudes.length > 0 && (
        <div className="tabla-solicitudes">
          <h3>Solicitudes Recibidas</h3>
          <p className="tabla-subtitulo">Estudiantes que han solicitado su tutoría para las olimpiadas</p>

          <table className="tabla">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Área y Categoría</th>
                <th>Relación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>
                    {s.area}
                    <br />
                    Grado: {s.grado}
                  </td>
                  <td>{s.relacion}</td>
                  <td>
                    <span className={`estado ${s.estado.toLowerCase()}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    {s.estado === 'Pendiente' && (
                      <>
                        <button className="btn-rechazar" onClick={() => actualizarEstado(s.id, 'Rechazada')}>
                          <X size={16} style={{ marginRight: '0.4rem' }} />
                          Rechazar
                        </button>

                        <button className="btn-aceptar" onClick={() => actualizarEstado(s.id, 'Aceptada')}>
                          <Check size={16} style={{ marginRight: '0.4rem' }} />
                          Aceptar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     
    </div>
  );
};

export default SolicitudesTutoria;
