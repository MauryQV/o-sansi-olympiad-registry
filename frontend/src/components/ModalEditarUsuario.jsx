// src/components/ModalEditarUsuario.jsx
import React, { useState } from 'react';
import '../styles/ModalNuevoUsuario.css'; // Usaremos el mismo estilo
import { X } from 'lucide-react';

const ModalEditarUsuario = ({ usuario, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre || '',
    correo: usuario.correo || '',
    telefono: usuario.telefono || '',
    rol: usuario.rol || '',
    contraseña: '',
    activo: usuario.estado === 'Activo'
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'nombre') {
      const soloLetras = value.replace(/[0-9]/g, '');
      if (soloLetras.length <= 70) {
        setFormData(prev => ({ ...prev, [name]: soloLetras }));
      }
    } else if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      if (soloNumeros.length <= 8) {
        setFormData(prev => ({ ...prev, [name]: soloNumeros }));
      }
    } else if (name === 'contraseña') {
      if (value.length <= 50) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.length > 70) {
      nuevosErrores.nombre = 'El nombre no puede superar los 70 caracteres.';
    }

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else if (!formData.correo.endsWith('@gmail.com')) {
      nuevosErrores.correo = 'El correo debe terminar en @gmail.com.';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El número de teléfono es obligatorio.';
    } else if (formData.telefono.length !== 8) {
      nuevosErrores.telefono = 'El número debe tener exactamente 8 dígitos.';
    }

    if (!formData.rol) {
      nuevosErrores.rol = 'Debe seleccionar un rol.';
    }

    const regexContraseña = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,50}$/;
    if (!formData.contraseña.trim()) {
      nuevosErrores.contraseña = 'La contraseña es obligatoria.';
    } else if (!regexContraseña.test(formData.contraseña)) {
      nuevosErrores.contraseña = 'Debe tener 8-50 caracteres, una mayúscula y un carácter especial.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      console.log('Datos actualizados:', formData);
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

