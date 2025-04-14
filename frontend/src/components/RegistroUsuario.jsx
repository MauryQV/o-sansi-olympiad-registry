import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/RegistroUsuario.css';

const RegistroUsuario = () => {
  const [userType, setUserType] = useState('competidor');

  const initialForm = {
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: '',
    email: '',
    department: '',
    province: '',
    school: '',
  };

  const [formDataCompetidor, setFormDataCompetidor] = useState(initialForm);
  const [formDataTutor, setFormDataTutor] = useState(initialForm);
  const [errorsCompetidor, setErrorsCompetidor] = useState({});
  const [errorsTutor, setErrorsTutor] = useState({});

  const currentFormData = userType === 'competidor' ? formDataCompetidor : formDataTutor;
  const setCurrentFormData = userType === 'competidor' ? setFormDataCompetidor : setFormDataTutor;
  const currentErrors = userType === 'competidor' ? errorsCompetidor : errorsTutor;
  const setCurrentErrors = userType === 'competidor' ? setErrorsCompetidor : setErrorsTutor;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCurrentFormData({ ...currentFormData, [id]: value });
  };

  const handleNameChange = (e) => {
    const { id } = e.target;
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
    setCurrentFormData({ ...currentFormData, [id]: filtered });
  };

  const handleIdChange = (e) => {
    const filtered = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCurrentFormData({ ...currentFormData, idNumber: filtered });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.slice(0, 50);
    setCurrentFormData({ ...currentFormData, email: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const data = currentFormData;

    if (!/^[a-zA-Z\s]{2,25}$/.test(data.firstName)) newErrors.firstName = 'Debe ingresar su Nombre.';
    if (!/^[a-zA-Z\s]{2,25}$/.test(data.lastName)) newErrors.lastName = 'Debe ingresar su Apellido.';
    if (!/^\d{5,8}$/.test(data.idNumber)) newErrors.idNumber = 'Número de Carnet inválido.';
    if (!data.birthDate) newErrors.birthDate = 'Debe seleccionar su fecha de nacimiento.';
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(data.email)) newErrors.email = 'Correo inválido.';

    if (userType === 'competidor') {
      if (!data.department) newErrors.department = 'Debe seleccionar su departamento.';
      if (!data.province) newErrors.province = 'Debe seleccionar su provincia.';
      if (!data.school) newErrors.school = 'Debe seleccionar su centro educativo.';
    }

    setCurrentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = currentFormData;
      console.log('Datos válidos:', data);
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Por favor, inicia sesión para continuar.',
        confirmButtonColor: '#0284C7'
      });
    }
  };

  const renderFormFields = () => {
    const data = currentFormData;
    const errs = currentErrors;

    return (
      <>
        <div className="registro-row">
          <div className="registro-group">
            <label>Nombre(s)*</label>
            <input type="text" id="firstName" value={data.firstName} onChange={handleNameChange} className={errs.firstName ? 'error' : ''} placeholder="Juan" />
            {errs.firstName && <span className="error-message">{errs.firstName}</span>}
          </div>
          <div className="registro-group">
            <label>Apellido(s)*</label>
            <input type="text" id="lastName" value={data.lastName} onChange={handleNameChange} className={errs.lastName ? 'error' : ''} placeholder="Pérez" />
            {errs.lastName && <span className="error-message">{errs.lastName}</span>}
          </div>
        </div>

        <div className="registro-row">
          <div className="registro-group">
            <label>Carnet de Identidad*</label>
            <input type="text" id="idNumber" value={data.idNumber} onChange={handleIdChange} className={errs.idNumber ? 'error' : ''} placeholder="12345678" />
            {errs.idNumber && <span className="error-message">{errs.idNumber}</span>}
          </div>
          <div className="registro-group">
            <label>Fecha de Nacimiento*</label>
            <input type="date" id="birthDate" value={data.birthDate} onChange={handleChange} className={errs.birthDate ? 'error' : ''} />
            {errs.birthDate && <span className="error-message">{errs.birthDate}</span>}
          </div>
        </div>

        <div className="registro-group">
          <label>Correo Electrónico*</label>
          <input type="email" id="email" value={data.email} onChange={handleEmailChange} className={errs.email ? 'error' : ''} placeholder="correo@ejemplo.com" />
          {errs.email && <span className="error-message">{errs.email}</span>}
        </div>

        {userType === 'competidor' && (
          <>
            <div className="registro-row">
              <div className="registro-group">
                <label>Departamento*</label>
                <select id="department" value={data.department} onChange={handleChange} className={errs.department ? 'error' : ''}>
                  <option value="">Seleccionar departamento</option>
                  <option value="cochabamba">Cochabamba</option>
                </select>
                {errs.department && <span className="error-message">{errs.department}</span>}
              </div>
              <div className="registro-group">
                <label>Provincia*</label>
                <select id="province" value={data.province} onChange={handleChange} className={errs.province ? 'error' : ''}>
                  <option value="">Seleccionar provincia</option>
                  <option value="Cercado">Cercado</option>
                </select>
                {errs.province && <span className="error-message">{errs.province}</span>}
              </div>
            </div>

            <div className="registro-group">
              <label>Centro Educativo*</label>
              <select id="school" value={data.school} onChange={handleChange} className={errs.school ? 'error' : ''}>
                <option value="">Seleccionar centro educativo</option>
                <option value="maryknoll">Maryknoll</option>
              </select>
              {errs.school && <span className="error-message">{errs.school}</span>}
            </div>
          </>
        )}

        <button type="submit" className="registro-btn">Registrarse</button>
        <button type="button" className="registro-btn cancelar" onClick={() => window.location.href = '/inicio'}>Cancelar</button>
        <p className="registro-login">¿Ya tienes una cuenta? <a href="#">Inicia sesión aquí</a></p>
      </>
    );
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
        <form onSubmit={handleSubmit} className="registro-form">
          {renderFormFields()}
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;
