import React, { useState } from 'react';
import '../styles/RegistroUsuario.css';

const RegistroUsuario = () => {
  const [userType, setUserType] = useState('competidor');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: '',
    email: '',
    department: '',
    province: '',
    school: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNameChange = (e) => {
    const { id } = e.target;
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
    setFormData({ ...formData, [id]: filtered });
  };

  const handleIdChange = (e) => {
    const filtered = e.target.value.replace(/\D/g, '').slice(0, 8);
    setFormData({ ...formData, idNumber: filtered });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.slice(0, 50);
    setFormData({ ...formData, email: value });
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!/^[a-zA-Z\s]{2,25}$/.test(formData.firstName)) {
      newErrors.firstName = 'Debe ingresar su Nombre.';
    }
    if (!/^[a-zA-Z\s]{2,25}$/.test(formData.lastName)) {
      newErrors.lastName = 'Debe ingresar su Apellido.';
    }
    if (!/^\d{5,8}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'Numero de Carnet inválido.';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Debe seleccionar su fecha de nacimiento.';
    }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Correo inválido.';
    }
    if (!formData.department) {
      newErrors.department = 'Debe seleccionar su departamento.';
    }
    if (!formData.province) {
      newErrors.province = 'Debe seleccionar su provincia.';
    }
    if (!formData.school) {
      newErrors.school = 'Debe seleccionar su centro educativo.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Datos válidos:', formData);
    }
  };

  return (
    <div className="registro-wrapper">
      <h1 className="registro-title">Olimpiadas Científicas</h1>
      <div className="registro-container">
        <h2>Registro</h2>
        <p>Crea una cuenta para participar en las olimpiadas</p>
        <div className="registro-toggle">
          <button className={userType === 'competidor' ? 'active' : ''} onClick={() => setUserType('competidor')}>Competidor</button>
          <button className={userType === 'tutor' ? 'active' : ''} onClick={() => setUserType('tutor')}>Tutor</button>
        </div>

        {userType === 'competidor' && (
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="registro-row">
              <div className="registro-group">
                <label>Nombre(s)*</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleNameChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Juan"
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="registro-group">
                <label>Apellido(s)*</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleNameChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Pérez"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="registro-row">
              <div className="registro-group">
                <label>Carnet de Identidad*</label>
                <input
                  type="text"
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={handleIdChange}
                  className={errors.idNumber ? 'error' : ''}
                  placeholder="12345678"
                />
                {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
              </div>
              <div className="registro-group">
                <label>Fecha de Nacimiento*</label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={errors.birthDate ? 'error' : ''}
                />
                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
              </div>
            </div>

            <div className="registro-group">
              <label>Correo Electrónico*</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleEmailChange}
                className={errors.email ? 'error' : ''}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="registro-row">
              <div className="registro-group">
                <label>Departamento*</label>
                <select
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={errors.department ? 'error' : ''}
                  >
                    <option value="">Seleccionar departamento</option>
                    <option value="cochabamba">Cochabamba</option>
                  </select>
                  {errors.department && <span className="error-message">{errors.department}</span>}
              </div>
              <div className="registro-group">
                <label>Provincia*</label>
                <select
                  id="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={errors.province ? 'error' : ''}
                >
                  <option value="">Seleccionar provincia</option>
                  <option value="Cercado">Cercado</option>
                </select>
                {errors.province && <span className="error-message">{errors.province}</span>}

              </div>
            </div>

            <div className="registro-group">
              <label>Centro Educativo*</label>
              <select
                id="school"
                value={formData.school}
                onChange={handleChange}
                className={errors.school ? 'error' : ''}
              >
                <option value="">Seleccionar centro educativo</option>
                <option value="maryknoll">Maryknoll</option>
              </select>
              {errors.school && <span className="error-message">{errors.school}</span>}
            </div>

            <button type="submit" className="registro-btn">Registrarse</button>
            <button type="button" className="registro-btn cancelar" onClick={() => window.location.href = '/inicio'}> Cancelar</button>

            <p className="registro-login">¿Ya tienes una cuenta? <a href="#">Inicia sesión aquí</a></p>
          </form>
        )}

        {userType === 'tutor' && (
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="registro-row">
              <div className="registro-group">
                <label>Nombre(s)*</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleNameChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Juan"
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="registro-group">
                <label>Apellido(s)*</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleNameChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Pérez"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="registro-row">
              <div className="registro-group">
                <label>Carnet de Identidad*</label>
                <input
                  type="text"
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={handleIdChange}
                  className={errors.idNumber ? 'error' : ''}
                  placeholder="12345678"
                />
                {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
              </div>
              <div className="registro-group">
                <label>Fecha de Nacimiento*</label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={errors.birthDate ? 'error' : ''}
                />
                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
              </div>
            </div>

            <div className="registro-group">
              <label>Correo Electrónico*</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleEmailChange}
                className={errors.email ? 'error' : ''}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <button type="submit" className="registro-btn">Registrarse</button>
            <button type="button" className="registro-btn cancelar" onClick={() => window.location.href = '/inicio'}>Cancelar</button>
            <p className="registro-login">¿Ya tienes una cuenta? <a href="#">Inicia sesión aquí</a></p>
          </form>
        )}

      </div>
    </div>
  );
};

export default RegistroUsuario;
