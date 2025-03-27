import React, { useEffect } from 'react';

const InicioAdministrador = ({ setIsAdmin }) => {
  useEffect(() => {
    // Cambiar el estado para indicar que el usuario es administrador
    setIsAdmin(true);
  }, [setIsAdmin]);

  return (
    <div>
      <h1>Bienvenido Administrador</h1>
      {/* Aquí puedes agregar el contenido que desees mostrar en la vista de administración */}
    </div>
  );
};

export default InicioAdministrador;
