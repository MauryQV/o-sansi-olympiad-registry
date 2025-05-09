// src/components/ModalEditarUsuario.jsx
import React, { useState } from 'react';
import '../../styles/AdminGestionUsuarios/ModalNuevoUsuario.css'; // Usare el mismo estilo
import { X } from 'lucide-react';
import {validateUsuarioForm, handleUsuarioInputChange} from '../../forms/usuarioFormHandler';

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
            className={errores.nombre ? "input-error" : ""}
            value={formData.nombre}
            onChange={handleChange}
            
          />
          {errores.nombre && <p className="error-campo">{errores.nombre}</p>}

          <label>Correo Electrónico *</label>
          <input
            type="text"
            name="correo"
            className={errores.correo ? "input-error" : ""}
            value={formData.correo}
            onChange={handleChange}
            
          />
          {errores.correo && <p className="error-campo">{errores.correo}</p>}

          <label>Número de Teléfono *</label>
          <input
            type="text"
            name="telefono"
            className={errores.telefono ? "input-error" : ""}
            value={formData.telefono}
            onChange={handleChange}
            
          />
          {errores.telefono && <p className="error-campo">{errores.telefono}</p>}

          <label>Rol *</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className={errores.rol ? "input-error" : ""}
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
            className={errores.contraseña ? "input-error" : ""}
            placeholder="Escriba nueva contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            
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

          <div className="modales-botones-nuevo-usuario">
            <button type="button" className="boton-cancelar-usuario-nuevo" onClick={onClose}>Cancelar</button>
            <button type="submit" className="boton-crear-usuario-nuevo ">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;

