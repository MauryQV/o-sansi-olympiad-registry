// src/components/Usuarios.jsx
import React, { useState } from 'react';
import '../../styles/AdminGestionUsuarios/AdminGestionUsuario.css';
import { Edit2, Trash2, User } from 'lucide-react';
import ModalNuevoUsuario from './ModalNuevoUsuario';
import ModalEditarUsuario from './ModalEditarUsuario';
import lapizEditar from '../../image/editarLapiz.svg'; 
import borrarUsuario from '../../image/borrarUsuario.svg';
import ModalEliminarUsuario from './ModalEliminarUsuario';
import { actualizarUsuarioEnLista } from '../../utils/actualizarUsuario';
import nuevoUsuario from '../../image/nuevoUsuario.svg';

const usuariosEjemplo = [
  {
    id: 1,
    nombre: 'Juanito Mamani',
    correo: 'juanito@gmail.com',
    rol: 'Administrador',
    telefono: '77712345',
    estado: 'Activo',
    contraseña: '9388259'
  },
  {
    id: 2,
    nombre: 'Luis Flores',
    correo: 'luchito@gmail.com',
    rol: 'Cajero',
    telefono: '77723456',
    estado: 'Activo',
    contraseña: '9388258'
  },
  {
    id: 3,
    nombre: 'Alejandra Sandoval',
    correo: 'alesandoval@gmail.com',
    rol: 'Tutor',
    telefono: '77734567',
    estado: 'Activo',
    contraseña: '9388245'
  },
  {
    id: 4,
    nombre: 'Pedro Pérez',
    correo: 'pedrito@gmail.com',
    rol: 'Tutor',
    telefono: '77745678',
    estado: 'Activo',
    contraseña: '923332422-A'
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

  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios([...usuarios, { id: Date.now(), ...nuevoUsuario, estado: 'Activo' }]);
  };
//filtro porr rol
const [filtroRol, setFiltroRol] = useState('Todos');

const usuariosFiltrados = filtroRol === 'Todos'
  ? usuarios
  : usuarios.filter(usuario => usuario.rol === filtroRol);

  return (
    <div className="gestion-usuario">
      <div className="gestion-boton">
        <h2><b>Gestión de Usuarios</b></h2>
        <div className="acomodar-boton">
          <button
            className="boton-nuevo-usuario"
            onClick={() => setModalNuevoUsuarioAbierto(true)}
          >
            <img
              src={nuevoUsuario}
              alt="nuevo-usuario"
              className="icono-nuevo-usuario" />
              Nuevo Usuario
          </button>
        </div>
      </div>
      
      <div className="gestion-usuarios-header">
        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
          <option value="Todos">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Cajero">Cajero</option>
          <option value="Tutor">Tutor</option>
          <option value="Competidor">Competidor</option>
        </select>
      </div>
      

      <div className="gestion-usuario-grid">
        {usuariosFiltrados.map(usuario => (
          <div key={usuario.id} className="gestion-usuario-card">
            <div className="gestion-usuario-inicio-dato">
              <div className="nombres-con-icono">
                <User className="usuario-de-cada-tar" size={30} />
                <span  className="nombre-usuario-texto"><b>{usuario.nombre}</b></span>
              </div>
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
              <span className="correo-usuario-entre-iconos"><b>{usuario.correo}</b></span>
            </div>
            <div className="gestion-usuario-dato">
              <span>Rol:</span>
              <span className="tag-rol"><b>{usuario.rol}</b></span>
            </div>
            <div className="gestion-usuario-dato">
              <span>Teléfono:</span>
              <span>{usuario.telefono}</span>
            </div>
            <div className="gestion-usuario-dato">
              <span>Estado:</span>
              <span className="tag-estado"><b>{usuario.estado}</b></span>
            </div>

            {modalNuevoUsuarioAbierto && (
              <ModalNuevoUsuario 
                onClose={() => setModalNuevoUsuarioAbierto(false)}
                onAgregarUsuario={agregarUsuario} 
              />
            )}

            {modalEditarAbierto && usuarioSeleccionado && (
              <ModalEditarUsuario
              usuario={usuarioSeleccionado}
              onClose={() => setModalEditarAbierto(false)}
              onActualizarUsuario={(actualizado) => {
                setUsuarios(actualizarUsuarioEnLista(usuarios, actualizado));
                setModalEditarAbierto(false);
              }}
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