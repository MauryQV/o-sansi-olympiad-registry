import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]); // Cambia el estado inicial a un array
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Hacer una solicitud GET al backend
    axios.get('http://localhost:7777/api/users')
      .then(response => {
        setUsers(response.data); // Guarda el array de usuarios
        setLoading(false); // Indica que la carga ha terminado
      })
      .catch(error => {
        console.error('Error al obtener datos:', error);
        setLoading(false); // Indica que la carga ha terminado (incluso si hay un error)
      });
  }, []);

  return (
    <div>
      <h1>Frontend React</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;