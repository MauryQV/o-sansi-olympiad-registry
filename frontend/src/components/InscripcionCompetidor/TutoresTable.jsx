import React from 'react';
import { Trash2 } from 'lucide-react';
import '../../styles/InscripcionCompetidor/FormularioInscripcion.css';

const TutoresTable = ({ tutores, onDelete }) => (
  <>
    {tutores.length > 0 && (
      <table className="forminsc-tabla-tutores">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tutores.map((t, i) => (
            <tr key={i}>
              <td>{t.nombre_completo}</td>
              <td>{t.correo}</td>
              <td>{t.telefono}</td>
              <td>Tutor</td>
              <td>
                <button onClick={() => onDelete(i)} className="forminsc-btn-eliminar-tutor">
                  <Trash2 size={16} color='red' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <p className="forminsc-mensaje">Puede seleccionar hasta 3 tutores. {3 - tutores.length} disponibles</p>
  </>
);

export default TutoresTable;
