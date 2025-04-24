// src/components/Usuarios.jsx
import React, { useState } from 'react';
import '../styles/AdminGestionUsuario.css';
import { Edit2, Trash2, User } from 'lucide-react';

const usuariosEjemplo = [
  {
    id: 1,
    nombre: 'Juanito Mamani',
    correo: 'juanito@gmail.com',
    rol: 'Administrador',
    telefono: '77712345',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'Luis Flores',
    correo: 'luchito@gmail.com',
    rol: 'Cajero',
    telefono: '77723456',
    estado: 'Activo'
  },
  {
    id: 3,
    nombre: 'Alejandra Sandoval',
    correo: 'alesandoval@gmail.com',
    rol: 'Tutor',
    telefono: '77734567',
    estado: 'Activo'
  },
  {
    id: 4,
    nombre: 'Pedro Pérez',
    correo: 'pedrito@gmail.com',
    rol: 'Tutor',
    telefono: '77745678',
    estado: 'Activo'
  }
];

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState(usuariosEjemplo);

  return (
    <div className="gestion-usuario">
      <div className="gestion-boton">
        <h2>Gestión de Usuarios</h2>
        <div className="acomodar-boton">
            <button className="boton-nuevo-usuario">+ Nuevo Usuario</button>
        </div>
      </div>
      
      <div className="gestion-usuarios-header">
        <select>
          <option>Todos los roles</option>
        </select>

      </div>

      <div className="gestion-usuario-grid">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="gestion-usuario-card">
            <div className="gestion-usuario-inicio-dato">
              <User size={16} /> {usuario.nombre}
              <div className="acciones">
                <Edit2 size={16} />
                <Trash2 size={16} color="red" />
              </div>
            </div>
            <p><strong>Correo electrónico:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> <span className="tag-rol">{usuario.rol}</span></p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            <p><strong>Estado:</strong> <span className="tag-estado">{usuario.estado}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
