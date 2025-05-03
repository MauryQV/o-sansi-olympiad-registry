// src/components/ModalNuevoUsuario.jsx
import React, { useState } from 'react';
import '../styles/ModalNuevoUsuario.css';
import { X } from 'lucide-react';
import { initialUsuarioData, validateUsuarioForm } from '../forms/usuarioFormHandler';
import { handleUsuarioInputChange } from '../forms/usuarioFormHandler';

const ModalNuevoUsuario = ({ onClose, onAgregarUsuario }) => {
  const [formData, setFormData] = useState(initialUsuarioData);

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
      onAgregarUsuario(formData);
      setFormData({
        nombre: '',
        correo: '',
        telefono: '',
        rol: '',
        contraseña: '',
        activo: true
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Nuevo Usuario</h2>
          <button className="cerrar-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="modal-subtitulo">Complete la información para crear un usuario</p>

        <form className="form-nuevo-usuario" onSubmit={handleSubmit}>
          <label>Nombre Completo *</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombres y apellidos"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          {errores.nombre && <p className="error-campo">{errores.nombre}</p>}

          <label>Correo Electrónico *</label>
          <input
            type="email"
            name="correo"
            placeholder="ejemplo@correo.com"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          {errores.correo && <p className="error-campo">{errores.correo}</p>}

          <label>Número de Teléfono</label>
          <input
            type="text"
            name="telefono"
            placeholder="77712345"
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
            <option value="admin">Administrador</option>
            <option value="cajero">Cajero</option>
            <option value="tutor">Tutor</option>
            <option value="competidor">Competidor</option>
          </select>
          {errores.rol && <p className="error-campo">{errores.rol}</p>}

          <label>Contraseña *</label>
          <input
            type="password"
            name="contraseña"
            placeholder="Mínimo 8 caracteres"
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
            <button type="submit" className="btn-crear">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoUsuario;
