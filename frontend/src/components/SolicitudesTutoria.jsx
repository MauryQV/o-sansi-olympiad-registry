import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { X, Check } from 'lucide-react';
import '../styles/SolicitudesTutoria.css';

const solicitudesIniciales = [
  { id: 1, nombre: 'Maria Gonzáles', area: 'Matemáticas - Categoría Quinto Nivel', grado: '5to de Secundaria', relacion: 'Profesor', estado: 'Pendiente' },
  { id: 2, nombre: 'Juan Pérez', area: 'Física - Categoría 4S', grado: '4to de Secundaria', relacion: 'Padre/Madre', estado: 'Pendiente' },
  { id: 3, nombre: 'Carlos Rodríguez', area: 'Química - Categoría 2S', grado: '2do de Secundaria', relacion: 'Padre/Madre', estado: 'Aceptada' },
  { id: 4, nombre: 'Lucia Fernandez', area: 'Biología - Categoría 6S', grado: '6to de Secundaria', relacion: 'Profesor', estado: 'Rechazada' },
  { id: 5, nombre: 'Pedro Guamán', area: 'Biología - Categoría 6S', grado: '6to de Secundaria', relacion: 'Profesor', estado: 'Rechazada' },
];

const SolicitudesTutoria = () => {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);

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
    </div>
  );
};

export default SolicitudesTutoria;
