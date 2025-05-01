// src/components/ModalEditarUsuario.jsx
import React, { useState } from 'react';
import '../styles/ModalNuevoUsuario.css'; // Usaremos el mismo estilo
import { X } from 'lucide-react';
import {validateUsuarioForm, handleUsuarioInputChange} from '../forms/usuarioFormHandler';

const ModalEditarUsuario = ({ usuario, onClose, onActualizarUsuario }) => {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre || '',
    correo: usuario.correo || '',
    telefono: usuario.telefono || '',
    rol: usuario.rol || '',
    contraseña: usuario.contraseña || '',
    activo: usuario.estado === 'Activo'
  });

  const [errores, setErrores] = useState({});

  const handleChange = handleUsuarioInputChange(formData, setFormData);

  const validarFormulario = () => {
    const erroresValidados = validateUsuarioForm(formData);
    setErrores(erroresValidados);
    return Object.keys(erroresValidados).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validarFormulario()) {
      onActualizarUsuario({
        ...usuario,
        ...formData,
        estado: formData.activo ? 'Activo' : 'Inactivo'
      });
  
      onClose(); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Editar Usuario</h2>
          <button className="cerrar-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="modal-subtitulo">Complete la información para actualizar un usuario</p>

        <form className="form-nuevo-usuario" onSubmit={handleSubmit}>
          <label>Nombre Completo *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          {errores.nombre && <p className="error-campo">{errores.nombre}</p>}

          <label>Correo Electrónico *</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          {errores.correo && <p className="error-campo">{errores.correo}</p>}

          <label>Número de Teléfono *</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          {errores.telefono && <p className="error-campo">{errores.telefono}</p>}

          <label>Rol *</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Cajero">Cajero</option>
            <option value="Tutor">Tutor</option>
            <option value="Competidor">Competidor</option>
          </select>
          {errores.rol && <p className="error-campo">{errores.rol}</p>}

          <label>Contraseña *</label>
          <input
            type="password"
            name="contraseña"
            placeholder="Escriba nueva contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
          {errores.contraseña && <p className="error-campo">{errores.contraseña}</p>}

          <div className="activo-toggle">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo">Usuario activo</label>
          </div>

          <div className="modal-botones">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-crear">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;

