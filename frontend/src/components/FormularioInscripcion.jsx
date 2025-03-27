import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
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

  const [fileName, setFileName] = useState('');
  const [excelData, setExcelData] = useState([]);
  const [errorExcel, setErrorExcel] = useState('');


  // ✅ Cambiar entre Individual y Grupal
  const handleToggle = (isGroup) => {
    setIsGrupal(isGroup);
    setActiveTab('step1'); // Volver a Datos del Postulante
    setExcelData([]);
  };

  // ✅ Validaciones de formulario
  const validateForm = () => {
    if (!isGrupal) { 
      const { firstName, lastName, idNumber, email, birthDate } = formData;
      if (!/^[a-zA-Z\s]{1,25}$/.test(firstName)) {
        alert('El nombre solo debe contener letras y tener un máximo de 25 caracteres.');
        return false;
      }
      if (!/^[a-zA-Z\s]{1,25}$/.test(lastName)) {
        alert('El apellido solo debe contener letras y tener un máximo de 25 caracteres.');
        return false;
      }
      if (!/^\d{1,8}$/.test(idNumber)) {
        alert('El carnet de identidad debe contener solo números y no exceder 8 dígitos.');
        return false;
      }
      if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(email)) {
        alert('El correo debe ser válido y de tipo @gmail.com.');
        return false;
      }
      if (!birthDate) {
        alert('Por favor, ingrese su fecha de nacimiento.');
        return false;
      }
    } else { 
      if (!formData.file) {
        alert('Por favor, suba un archivo Excel con los datos de los postulantes.');
        return false;
      }
    }
    return true;
  };

  // ✅ Navegación entre pasos
  const getNextStep = () => {
    if (isGrupal) return activeTab === 'step1' ? 'step4' : 'step1';
    switch (activeTab) {
      case 'step1': return 'step2';
      case 'step2': return 'step3';
      case 'step3': return 'step4';
      default: return 'step1';
    }
  };

  const getPrevStep = () => {
    if (isGrupal) return 'step1';
    switch (activeTab) {
      case 'step2': return 'step1';
      case 'step3': return 'step2';
      case 'step4': return 'step3';
      default: return 'step1';
    }
  };

  const handleNext = () => {
    if (!validateForm()) return;
    setActiveTab(getNextStep());
  };

  const handlePrev = () => {
    setActiveTab(getPrevStep());
  };

  // ✅ Restricciones en inputs
  const handleNameChange = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
    handleInputChange(e);
  };

  const handleIdChange = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    handleInputChange(e);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // ✅ Manejo de carga de archivo Excel
  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      if (fileType !== 'xlsx' && fileType !== 'csv') {
        alert('Por favor, suba un archivo en formato .xlsx o .csv');
        return;
      }
  
      setFormData({ ...formData, file });
      setFileName(file.name);
      setErrorExcel('');
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        // Verificar columnas del archivo
        const requiredColumns = ["Apellidos", "Nombres", "CI", "Colegio", "Área"];
        const fileColumns = Object.keys(jsonData[0] || {});
        const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
  
        if (missingColumns.length > 0) {
          setErrorExcel(`El archivo Excel no tiene las columnas esperadas: ${missingColumns.join(', ')}`);
          setExcelData([]);
          return;
        } else {
          setErrorExcel(''); // Limpiar error si está bien
        }
  
        const filteredData = jsonData.map(row => ({
          apellidos: row["Apellidos"] || '',
          nombres: row["Nombres"] || '',
          ci: row["CI"] || '',
          colegio: row["Colegio"] || '',
          area: row["Área"] || ''
        }));
  
        setExcelData(filteredData);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  

  return (
    <div className="container mt-5">
      <h1 className="tituloInscripcion">Formulario de Inscripción - Olimpiada en Ciencias y Tecnología San Simón</h1>

      <div className="form-container">
        <ul className="nav-pills mb-3">
          <li className="nav-item"><a className={`nav-link ${activeTab === 'step1' ? 'active' : ''}`} href="#step1">Datos del Postulante</a></li>
          {!isGrupal && (
            <>
              <li className="nav-item"><a className={`nav-link ${activeTab === 'step2' ? 'active' : ''}`} href="#step2">Datos del Tutor/Representante</a></li>
              <li className="nav-item"><a className={`nav-link ${activeTab === 'step3' ? 'active' : ''}`} href="#step3">Datos Académicos y Área</a></li>
            </>
          )}
          <li className="nav-item"><a className={`nav-link ${activeTab === 'step4' ? 'active' : ''}`} href="#step4">Revisión y Pago</a></li>
        </ul>

        <div className="mb-3 text-center">
          <label className={`radio-btn ${!isGrupal ? 'selected' : ''}`} onClick={() => handleToggle(false)}>
            <input type="radio" name="inscripcion" checked={!isGrupal} readOnly />
            <span>Individual</span>
          </label>
          <label className={`radio-btn ${isGrupal ? 'selected' : ''}`} onClick={() => handleToggle(true)}>
            <input type="radio" name="inscripcion" checked={isGrupal} readOnly />
            <span>Grupal</span>
          </label>
        </div>
        
        <div className="tab-content">
          {activeTab === 'step1' && (
            <div>
              <h2>Formulario de Registro de Postulante</h2>
              {!isGrupal ? (
                <>
                  <InputField id="firstName" label="Nombres" value={formData.firstName} onChange={handleNameChange} placeholder="Ingrese su nombre" />
                  <InputField id="lastName" label="Apellidos" value={formData.lastName} onChange={handleNameChange} placeholder="Ingrese su apellido" />
                  <InputField id="idNumber" label="Carnet de Identidad" value={formData.idNumber} onChange={handleIdChange} placeholder="Ingrese su CI" />
                  <InputField id="birthDate" label="Fecha de Nacimiento" type="date" value={formData.birthDate} onChange={handleInputChange} />
                  <InputField id="email" label="Correo Electrónico" type="email" value={formData.email} onChange={handleInputChange} placeholder="Ingrese su correo" />
                </>
              ) : (
                <div>
                  <h3>Subir Archivo Excel</h3>
                  <input type="file" className="form-control" onChange={handleFileChange} />
                  {fileName && <p className="mt-2">Archivo cargado: {fileName}</p>}
                  {errorExcel && <p className="text-danger">{errorExcel}</p>}

                  {excelData.length > 0 && (
                    <table className="table mt-3">
                      <thead><tr><th>Apellidos</th><th>Nombres</th><th>CI</th><th>Colegio</th><th>Área</th></tr></thead>
                      <tbody>{excelData.map((row, index) => (<tr key={index}><td>{row.apellidos}</td><td>{row.nombres}</td><td>{row.ci}</td><td>{row.colegio}</td><td>{row.area}</td></tr>))}</tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}  
        </div>
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={() => alert('Cancelar')}>Cancelar</button>
              <div>
                <button className="btn btn-secondary" onClick={handlePrev} disabled={activeTab === 'step1'}>Anterior</button>
                <button className="btn btn-primary" onClick={handleNext}>{activeTab === 'step4' ? 'Finalizar' : 'Siguiente'}</button>
              </div>
          </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange, placeholder }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input type={type} className="form-control" id={id} value={value} onChange={onChange} placeholder={placeholder} required />
  </div>
);

export default FormularioInscripcion;
