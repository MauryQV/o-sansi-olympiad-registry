import React, { useState, useEffect } from 'react';
import '../styles/FormularioInscripcion.css';


const FormularioInscripcion = () => {
  const [isGrupal, setIsGrupal] = useState(false);
  const [activeTab, setActiveTab] = useState('step1');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    birthDate: '',
    file: null
  });

  // Cambia la pestaña activa
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Maneja la navegación de los pasos
  const handleNext = () => {
    const { firstName, lastName, idNumber, email, birthDate } = formData;

    // Validar Nombre y Apellido
    if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      alert('El nombre solo debe contener letras');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      alert('El apellido solo debe contener letras');
      return;
    }

    // Validar Carnet de Identidad
    if (!/^\d{1,8}$/.test(idNumber)) {
      alert('El carnet de identidad debe ser numérico y no exceder los 8 caracteres');
      return;
    }

    // Validar Correo Electrónico
    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(email)) {
      alert('El correo debe ser un correo válido de tipo @gmail.com');
      return;
    }

    // Validar Fecha de Nacimiento
    if (!birthDate) {
      alert('Por favor, ingrese su fecha de nacimiento');
      return;
    }

    // Cambio de tab según el tipo de inscripción
    if (isGrupal) {
      if (activeTab === 'step1') {
        setActiveTab('step4');
      }
    } else {
      if (activeTab === 'step1') {
        setActiveTab('step2');
      } else if (activeTab === 'step2') {
        setActiveTab('step3');
      } else if (activeTab === 'step3') {
        setActiveTab('step4');
      }
    }
  };

  const handlePrev = () => {
    if (isGrupal) {
      if (activeTab === 'step4') {
        setActiveTab('step1');
      }
    } else {
      if (activeTab === 'step2') {
        setActiveTab('step1');
      } else if (activeTab === 'step3') {
        setActiveTab('step2');
      } else if (activeTab === 'step4') {
        setActiveTab('step3');
      }
    }
  };

  const handleToggle = () => {
    setIsGrupal(!isGrupal);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // Restricciones de los campos
  const handleNameChange = (e) => {
    // Permitir solo letras y espacios
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    handleInputChange(e);
  };

  const handleIdChange = (e) => {
    // Permitir solo números y limitar a 8 caracteres
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    handleInputChange(e);
  };

  const handleEmailChange = (e) => {
    // Validar correo tipo gmail
    e.target.value = e.target.value.toLowerCase();
    handleInputChange(e);
  };

  useEffect(() => {
    if (isGrupal && (activeTab === 'step2' || activeTab === 'step3')) {
      setActiveTab('step4');
    }
  }, [isGrupal, activeTab]);

  return (
    <div className="container mt-5">
      <div className = "tituloInscripcion"><h1>Formulario de Inscripción - Olimpiada en Ciencias y Tecnología San Simón</h1></div>
      <div className="form-container">
      <ul className="nav-pills mb-3" id="formSteps" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'step1' ? 'active' : ''}`}
            href="#step1"
            onClick={(e) => { e.preventDefault(); handleTabChange('step1'); }}
          >
            Datos del Postulante
          </a>
        </li>
        {!isGrupal && (
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === 'step2' ? 'active' : ''}`}
              href="#step2"
              onClick={(e) => { e.preventDefault(); handleTabChange('step2'); }}
            >
              Datos del Tutor/Representante
            </a>
          </li>
        )}
        {!isGrupal && (
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === 'step3' ? 'active' : ''}`}
              href="#step3"
              onClick={(e) => { e.preventDefault(); handleTabChange('step3'); }}
            >
              Datos Académicos y Área
            </a>
          </li>
        )}
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === 'step4' ? 'active' : ''}`}
            href="#step4"
            onClick={(e) => { e.preventDefault(); handleTabChange('step4'); }}
          >
            Revisión y Pago
          </a>
        </li>
      </ul>

      <div className="mb-3 text-center">
        <div className="custom-radio-buttons">
          <label className={`radio-btn ${!isGrupal ? 'selected' : ''}`} onClick={handleToggle}>
            <input
              type="radio"
              name="inscripcion"
              checked={!isGrupal}
              onChange={handleToggle}
            />
            <span>Individual</span>
          </label>
          <label className={`radio-btn ${isGrupal ? 'selected' : ''}`} onClick={handleToggle}>
            <input
              type="radio"
              name="inscripcion"
              checked={isGrupal}
              onChange={handleToggle}
            />
            <span>Grupal</span>
          </label>
        </div>
      </div>

      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'step1' ? 'show active' : ''}`} id="step1">
          <h2>Formulario de Registro de Postulante</h2>
          {!isGrupal ? (
            <div>
              <div className="form-group">
                <label htmlFor="firstName">Nombres</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleNameChange}
                  placeholder="Ingrese su nombre"
                  maxLength="20"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleNameChange}
                  placeholder="Ingrese su apellido"
                  maxLength="20"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="idNumber">Carnet de Identidad</label>
                <input
                  type="text"
                  className="form-control"
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={handleIdChange}
                  placeholder="Ingrese su CI"
                  maxLength="8"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="birthDate">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="Ingrese su correo"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
                <div className='sArchivo'><h3>Subir Archivo Excel</h3></div>
              <div className="form-group">
                <input type="file" className="form-control" id="fileUpload" onChange={handleFileChange} />
              </div>
              <div className="mt-3">
                <p>Vista Previa de Datos Cargados</p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Apellidos</th>
                      <th>Nombres</th>
                      <th>CI</th>
                      <th>Colegio</th>
                      <th>Área</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pérez</td>
                      <td>Juan</td>
                      <td>12345678</td>
                      <td>Marykol</td>
                      <td>Biología</td>
                    </tr>
                    <tr>
                      <td>López</td>
                      <td>María</td>
                      <td>87654321</td>
                      <td>San Andrés</td>
                      <td>Física</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={() => alert('Cancelar')}>Cancelar</button>
          <div>
            <button className="btn btn-secondary" onClick={handlePrev} disabled={activeTab === 'step1'}>Anterior</button>
            <button className="btn btn-primary" onClick={handleNext}>{activeTab === 'step4' ? 'Finalizar' : 'Siguiente'}</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
