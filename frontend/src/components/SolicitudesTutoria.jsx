import React from 'react';
import Swal from 'sweetalert2';
import { X, Check } from 'lucide-react';
import '../styles/SolicitudesTutoria.css';
import { useSolicitudesTutoria } from '../hooks/solicitudesTutoria';
import { aceptarSolicitudTutor } from '../services/solicitudTutor';
import { rechazarSolicitudTutor } from '../services/solicitudTutor';

const SolicitudesTutoria = () => {
  const { solicitudes, setSolicitudes, motivosRechazo, loading, error } = useSolicitudesTutoria();

  const actualizarEstado = (id, nuevoEstado, motivo = '') => {
    setSolicitudes(prev =>
      prev.map(s =>
        s.id === id ? { ...s, estado: nuevoEstado } : s
      )
    );

    Swal.fire({
      icon: nuevoEstado === 'Aceptada' ? 'success' : 'error',
      title: `Solicitud ${nuevoEstado === 'Aceptada' ? 'aceptada' : 'rechazada'}`,
      text: nuevoEstado === 'Aceptada'
        ? 'Has validado la solicitud del competidor.'
        : `Has rechazado la solicitud. Motivo: ${motivo}`,
      confirmButtonColor: nuevoEstado === 'Aceptada' ? '#0284C7' : '#E4272A',
    });
  };

  const aceptarSolicitud = (id) => {
    Swal.fire({
      title: '¿Aceptar solicitud?',
      text: '¿Estás seguro de aceptar esta solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0284C7',
    }).then((result) => {
      if (result.isConfirmed) {
        aceptarSolicitudTutor(id); 
        actualizarEstado(id, 'Aceptada');
      }
    });
  };

  const rechazarSolicitud = (id) => {
    const opcionesMotivos = {};
    motivosRechazo.forEach(motivo => {
      opcionesMotivos[motivo.id] = motivo.mensaje;
    });

    Swal.fire({
      title: 'Motivo del rechazo',
      input: 'select',
      inputOptions: opcionesMotivos,
      inputPlaceholder: 'Selecciona un motivo',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E4272A',
      inputValidator: (value) => {
        if (!value) return 'Debes seleccionar un motivo.';
      }
    }).then(result => {
      if (result.isConfirmed) {
        const motivoSeleccionado = parseInt(result.value);

        if (motivoSeleccionado === 7) {
          // Motivo personalizado
          Swal.fire({
            title: 'Especifica el motivo',
            input: 'textarea',
            inputPlaceholder: 'Describe el motivo...',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#E4272A',
            inputValidator: (value) => {
              if (!value || value.trim() === '') {
                return 'Debes especificar el motivo.';
              }
            }
          }).then(async (res) => {
            if (res.isConfirmed && res.value) {
              try {
                await rechazarSolicitudTutor(id, motivoSeleccionado, res.value.trim());
                actualizarEstado(id, 'Rechazada', res.value.trim());
              } catch (err) {
                console.error('Error al rechazar solicitud:', err);
                Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
              }
            }
          });
        } else {
          // Motivo predefinido
          const motivoTexto = opcionesMotivos[motivoSeleccionado];
          
          try {
            rechazarSolicitudTutor(id, motivoSeleccionado)
              .then(() => {
                actualizarEstado(id, 'Rechazada', motivoTexto);
              })
              .catch((err) => {
                console.error('Error al rechazar solicitud:', err);
                Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
              });
          } catch (err) {
            console.error('Error al rechazar solicitud:', err);
            Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
          }
        }
      }
    });
  };

  return (
    <div className="solicitudes-tutoria-container">
      <h2>Solicitudes de Tutoría</h2>
      <p className="descripcion-subtitulo">Gestione las solicitudes de tutoría de los competidores</p>

      {!loading && solicitudes.length === 0 && (
        <div className="mensaje-vacio">
          <p>NO HAY SOLICITUDES</p>
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
                        <button className="btn-rechazar" onClick={() => rechazarSolicitud(s.id)}>
                          <X size={16} style={{ marginRight: '0.4rem' }} />
                          Rechazar
                        </button>

                        <button className="btn-aceptar" onClick={() => aceptarSolicitud(s.id)}>
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