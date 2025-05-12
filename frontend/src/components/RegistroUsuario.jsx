import React from 'react';
import '../styles/RegistroUsuario.css';
import { useRegistroForm } from '../hooks/useRegistroForm';


const RegistroUsuario = () => {
  const {
    userType, setUserType,
    formData, tutorData,
    departamentos, provincias, colegios,areas,
    errors,
    handleInputChange, handleNameChange, handleIdChange, handleEmailChange,
    handleSubmit
  } = useRegistroForm();

  const data = userType === 'competidor' ? formData : tutorData;

  return (
    <div className="registro-wrapper">
      <h1 className="registro-title">Olimpiadas Científicas</h1>
      <div className="registro-container">
        <h2>Registro</h2>
        <p>Crea una cuenta para participar en las olimpiadas</p>
        <div className="registro-toggle">
          <button
            className={userType === 'competidor' ? 'active' : ''}
            onClick={() => setUserType('competidor')}
            type="button"
          >
            Competidor
          </button>
          <button
            className={userType === 'tutor' ? 'active' : ''}
            onClick={() => setUserType('tutor')}
            type="button"
          >
            Tutor
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className="registro-form">
          <div className="registro-row">
            <div className="registro-group">
              <label>Nombre(s)*</label>
              <input
                id="firstName"
                value={data.firstName}
                onChange={handleNameChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Juan"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
  
            <div className="registro-group">
              <label>Apellido(s)*</label>
              <input
                id="lastName"
                value={data.lastName}
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
                id="idNumber"
                value={data.idNumber}
                onChange={handleIdChange}
                className={errors.idNumber ? 'error' : ''}
                placeholder="12345678CB"
              />
              {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
            </div>
  
            {/* Sólo el competidor tiene Fecha de Nacimiento */}
            {userType === 'competidor' && (
              <div className="registro-group">
                <label>Fecha de Nacimiento*</label>
                <input
                  type="date"
                  id="birthDate"
                  value={data.birthDate}
                  onChange={handleInputChange}
                  className={errors.birthDate ? 'error' : ''}
                />
                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
              </div>
            )}
  
            {/* Sólo el tutor tiene número de celular en esta sección */}
            {userType === 'tutor' && (
              <div className="registro-group">
                <label>Número de Celular*</label>
                <input
                  id="phone"
                  value={data.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="70123456"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            )}
          </div>
  
          <div className="registro-group">
            <label>Correo Electrónico*</label>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={handleEmailChange}
              className={errors.email ? 'error' : ''}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {userType === 'tutor' && (
  <div className="registro-group">
    <label>Área*</label>
    <select
  id="area"
  value={tutorData.area_id || ""} // Usar valor vacío si area_id es null o undefined
  onChange={handleInputChange}
  className={errors.area ? 'error' : ''}
>
  <option value="">Seleccionar área</option>
  {Array.isArray(areas) && areas.map(area => (
    <option key={area.id} value={area.id.toString()}>
      {area.nombre_area}
    </option>
  ))}
</select>
    {errors.area && <span className="error-message">{errors.area}</span>}
  </div>
)}

          {/* Competidor tiene Departamento, Provincia y Colegio */}
          {userType === 'competidor' && (
            <>
              <div className="registro-row">
                <div className="registro-group">
                  <label>Departamento*</label>
                  <select
                    id="department"
                    value={data.department}
                    onChange={handleInputChange}
                    className={errors.department ? 'error' : ''}
                  >
                    <option value="">Seleccionar departamento</option>
                    {departamentos.map(dep => (
                      <option key={dep.id} value={dep.id}>
                        {dep.nombre_departamento}
                      </option>
                    ))}
                  </select>
                  {errors.department && <span className="error-message">{errors.department}</span>}
                </div>
  
                <div className="registro-group">
                  <label>Provincia*</label>
                  <select
                    id="province"
                    value={data.province}
                    onChange={handleInputChange}
                    className={errors.province ? 'error' : ''}
                    disabled={!data.department}
                  >
                    <option value="">Seleccionar provincia</option>
                    {provincias.map(prov => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre_provincia}
                      </option>
                    ))}
                  </select>
                  {errors.province && <span className="error-message">{errors.province}</span>}
                </div>
              </div>
  
              <div className="registro-group">
                <label>Centro Educativo*</label>
                <select
                  id="school"
                  value={data.school}
                  onChange={handleInputChange}
                  className={errors.school ? 'error' : ''}
                  disabled={!data.province}
                >
                  <option value="">Seleccionar centro educativo</option>
                  {colegios.map(col => (
                    <option key={col.id} value={col.id}>
                      {col.nombre_colegio}
                    </option>
                  ))}
                </select>
                {errors.school && <span className="error-message">{errors.school}</span>}
              </div>
            </>
          )}
  
          <button type="submit" className="registro-btn">Registrarse</button>
          
          <p className="registro-login">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegistroUsuario;
