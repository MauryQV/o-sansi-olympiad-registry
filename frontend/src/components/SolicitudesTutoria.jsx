import React from 'react';
import Swal from 'sweetalert2';
import { X, Check } from 'lucide-react';
import '../styles/SolicitudesTutoria.css';
import { useSolicitudesTutoria } from '../hooks/solicitudesTutoria';

const MOTIVOS_RECHAZO = {
  error_envio: 'Solicitud enviada por error',
  datos_incorrectos: 'El estudiante está con datos incorrectos',
  tutor_equivocado: 'El estudiante eligió al tutor equivocado',
  no_reconocido: 'No reconozco a este estudiante',
  ya_asignado: 'Ya fue asignado por otro tutor',
  no_autorizado: 'No autorizo su participación',
  otro: 'Otro motivo',
};

const SolicitudesTutoria = () => {
  const { solicitudes, setSolicitudes, loading, error } = useSolicitudesTutoria();

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
        actualizarEstado(id, 'Aceptada');
      }
    });
  };

  const rechazarSolicitud = (id) => {
    Swal.fire({
      title: 'Motivo del rechazo',
      input: 'select',
      inputOptions: MOTIVOS_RECHAZO,
      inputPlaceholder: 'Selecciona un motivo',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E4272A',
      inputValidator: (value) => {
        if (!value) return 'Debes seleccionar un motivo.';
      }
    }).then(result => {
      if (result.isConfirmed) {
        const motivoKey = result.value;
        if (motivoKey === 'otro') {
          Swal.fire({
            title: 'Especifica el motivo',
            input: 'textarea',
            inputPlaceholder: 'Describe el motivo...',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            confirmButtonColor: '#E4272A',
          }).then(res => {
            if (res.isConfirmed) {
              actualizarEstado(id, 'Rechazada', res.value);
            }
          });
        } else {
          actualizarEstado(id, 'Rechazada', MOTIVOS_RECHAZO[motivoKey]);
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
