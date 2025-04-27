// src/components/Usuarios.jsx
import React, { useState } from 'react';
import '../styles/AdminGestionUsuario.css';
import { Edit2, Trash2, User } from 'lucide-react';
import ModalNuevoUsuario from './ModalNuevoUsuario';
import ModalEditarUsuario from './ModalEditarUsuario';
import lapizEditar from '../image/editarLapiz.svg'; 
import borrarUsuario from '../image/borrarUsuario.svg';
import ModalEliminarUsuario from './ModalEliminarUsuario';


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
  const [modalNuevoUsuarioAbierto, setModalNuevoUsuarioAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarAbierto(true);
  };

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const abrirModalEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminarAbierto(true);
  };



  return (
    <div className="gestion-usuario">
      <div className="gestion-boton">
        <h2>Gestión de Usuarios</h2>
        <div className="acomodar-boton">
          <button
            className="boton-nuevo-usuario"
            onClick={() => setModalNuevoUsuarioAbierto(true)}
          >
            + Nuevo Usuario
          </button>
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
                <img
                  src={lapizEditar}
                  alt="Editar"
                  className="icono-editar"
                  onClick={() => abrirModalEditar(usuario)}
                />
                <img
                  src={borrarUsuario}
                  alt="Borrar Usuario"
                  className="icono-borrar"
                  onClick={() => abrirModalEliminar(usuario)}
                />
              </div>
            </div>

            <div className="gestion-usuario-dato">
              <span>Correo electrónico:</span>
              <span>{usuario.correo}</span>
            </div>
            <div className="gestion-usuario-dato">
              <span>Rol:</span>
              <span className="tag-rol">{usuario.rol}</span>
            </div>
            <div className="gestion-usuario-dato">
              <span>Teléfono:</span>
              <span>{usuario.telefono}</span>
            </div>
            <div className="gestion-usuario-dato">
              <span>Estado:</span>
              <span className="tag-estado">{usuario.estado}</span>
            </div>

            {modalNuevoUsuarioAbierto && (
              <ModalNuevoUsuario onClose={() => setModalNuevoUsuarioAbierto(false)} />
            )}

            {modalEditarAbierto && usuarioSeleccionado && (
              <ModalEditarUsuario
                usuario={usuarioSeleccionado}
                onClose={() => setModalEditarAbierto(false)}
              />
            )}

            {modalEliminarAbierto && usuarioAEliminar && (
              <ModalEliminarUsuario
                usuario={usuarioAEliminar}
                onClose={() => setModalEliminarAbierto(false)}
                onConfirmarEliminar={() => {
                  setUsuarios(usuarios.filter(u => u.id !== usuarioAEliminar.id));
                  setModalEliminarAbierto(false);
                }}
              />
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;