import React, { useState } from 'react';

const TablaArea = () => {
  // Estado para almacenar las filas de la tabla
  const [rows, setRows] = useState([]);

  // Estado para controlar los campos de entrada
  const [codigo, setCodigo] = useState('');
  const [area, setArea] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Función para agregar una nueva fila
  const agregarFila = () => {
    const nuevaFila = { codigo, area, descripcion };
    setRows([...rows, nuevaFila]);

    // Limpiar campos después de agregar
    setCodigo('');
    setArea('');
    setDescripcion('');
  };

  // Función para eliminar una fila
  const eliminarFila = (index) => {
    const nuevaFila = rows.filter((_, i) => i !== index);
    setRows(nuevaFila);
  };

  // Función para editar una fila
  const editarFila = (index) => {
    const fila = rows[index];
    setCodigo(fila.codigo);
    setArea(fila.area);
    setDescripcion(fila.descripcion);

    // Eliminar la fila para poder reemplazarla después
    eliminarFila(index);
  };

  return (
    <div className="todo-area">
      <h2>AREA</h2>

      <div>
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Área"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button onClick={agregarFila}>Añadir</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Área</th>
            <th>Descripción</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((fila, index) => (
            <tr key={index}>
              <td>{fila.codigo}</td>
              <td>{fila.area}</td>
              <td>{fila.descripcion}</td>
              <td>
                <button onClick={() => editarFila(index)}>Editar</button>
              </td>
              <td>
                <button onClick={() => eliminarFila(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaArea;