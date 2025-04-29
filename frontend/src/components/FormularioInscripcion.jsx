import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Search, Trash2 } from 'lucide-react';
import '../styles/FormularioInscripcion.css';

const FormularioInscripcion = () => {
  const [area, setArea] = useState('');
  const [categoria, setCategoria] = useState('');
  const [grado, setGrado] = useState('');
  const [nivel, setNivel] = useState('');
  const [tutores, setTutores] = useState([]);
  const [nuevoTutor, setNuevoTutor] = useState('');
  const [relacion, setRelacion] = useState('');
  const [areaTutorSeleccionada, setAreaTutorSeleccionada] = useState('');
  const [errores, setErrores] = useState({});

  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [categoriasPorArea, setCategoriasPorArea] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
  const [tutoresDisponibles, setTutoresDisponibles] = useState([]);
// datos de  prueba  
  useEffect(() => {
    setAreasDisponibles(['Matemática', 'Química', 'Física', 'Biología', 'Robótica']);
    setCategoriasPorArea({
      Matemática: ['Primaria', 'Secundaria'],
      Química: ['Nivel 1', 'Nivel 2'],
      Física: ['Nivel A', 'Nivel B'],
      Biología: ['Celular', 'Ecología'],
      Robótica: ['Junior', 'Senior']
    });
    setGradosDisponibles(['1°', '2°', '3°', '4°', '5°', '6°']);
    setNivelesDisponibles(['Primaria', 'Secundaria']);
    setTutoresDisponibles([
      { nombre: 'Ana Martínez', correo: 'ana1@mail.com', telefono: '70123456', relacion: 'Madre', area: 'Biología' },
      { nombre: 'Ana Martínez', correo: 'ana2@mail.com', telefono: '70123457', relacion: 'Tutor', area: 'Física' },
      { nombre: 'Carlos Ramírez', correo: 'carlos@mail.com', telefono: '78912345', relacion: 'Padre', area: 'Física' },
      { nombre: 'Luisa Gómez', correo: 'luisa@mail.com', telefono: '71234567', relacion: 'Tutor', area: 'Matemática' },
      { nombre: 'Pedro López', correo: 'pedro@mail.com', telefono: '73456789', relacion: 'Profesor/a', area: 'Robótica' },
      { nombre: 'Ana Martínez', correo: 'ana3@mail.com', telefono: '70123458', relacion: 'Tutor', area: 'Física' },
      { nombre: 'Luis Torres', correo: 'luis@mail.com', telefono: '79999999', relacion: 'Padre', area: 'Matemática' },
      { nombre: 'Marta Vega', correo: 'marta@mail.com', telefono: '75551234', relacion: 'Tutor', area: 'Biología' },
      { nombre: 'Rosa Díaz', correo: 'rosa@mail.com', telefono: '72112233', relacion: 'Profesor/a', area: 'Biología' }
    ]);
  }, []);

  useEffect(() => {
    if (area && categoriasPorArea[area]) {
      setCategoriasDisponibles(categoriasPorArea[area]);
    } else {
      setCategoriasDisponibles([]);
    }
  }, [area, categoriasPorArea]);

  const agregarTutor = () => {
    if (nuevoTutor && relacion && areaTutorSeleccionada && tutores.length < 3) {
      const tutor = tutoresDisponibles.find(t => t.nombre === nuevoTutor && t.area === areaTutorSeleccionada);
      const nuevo = tutor || {
        nombre: nuevoTutor,
        correo: 'sincorreo@mail.com',
        telefono: '00000000',
        relacion: relacion,
        area: areaTutorSeleccionada
      };
      setTutores([...tutores, nuevo]);
      setNuevoTutor('');
      setRelacion('');
      setAreaTutorSeleccionada('');
    }
  };

  const eliminarTutor = (index) => {
    const nuevos = [...tutores];
    nuevos.splice(index, 1);
    setTutores(nuevos);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!area) nuevosErrores.area = true;
    if (!categoria) nuevosErrores.categoria = true;
    if (!grado) nuevosErrores.grado = true;
    if (!nivel) nuevosErrores.nivel = true;
    if (tutores.length === 0) nuevosErrores.tutores = true;
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = () => {
    if (validarFormulario()) {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu inscripción ha sido registrada correctamente.',
        confirmButtonColor: '#3085d6',
      });
      setArea('');
      setCategoria('');
      setGrado('');
      setNivel('');
      setTutores([]);
      setErrores({});
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Faltan campos obligatorios',
        text: 'Por favor, complete todos los campos marcados con *.',
        confirmButtonColor: '#d33',
      });
    }
  };
  const tutoresFiltrados = tutoresDisponibles.filter(t => t.area === areaTutorSeleccionada);

  return (
    <div className="forminsc-contenedor">
      <h1 className="forminsc-titulo">Inscripción a Olimpiadas Científicas</h1>
      <p className="forminsc-subtitulo">Complete el formulario para inscribirse en una competencia</p>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Información de la Competencia</h2>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Área *</label>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={errores.area ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione un área</option>
              {areasDisponibles.map((a, i) => (
                <option key={i} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="forminsc-campo">
            <label>Categoría *</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={categoriasDisponibles.length === 0} className={errores.categoria ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione una categoría</option>
              {categoriasDisponibles.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="forminsc-fila">
          <div className="forminsc-campo">
            <label>Grado *</label>
            <select value={grado} onChange={(e) => setGrado(e.target.value)} className={errores.grado ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione su grado</option>
              {gradosDisponibles.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="forminsc-campo">
            <label>Nivel Educativo *</label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)} className={errores.nivel ? 'forminsc-input-error' : ''}>
              <option value="">Seleccione un nivel</option>
              {nivelesDisponibles.map((n, i) => (
                <option key={i} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="forminsc-seccion">
        <h2 className="forminsc-seccion-titulo">Tutores</h2>

        <div className="forminsc-fila-buscador-alineado">
          <div className="forminsc-input-con-icono">
            <input type="text" className="forminsc-input" placeholder="Buscar tutor..." value={nuevoTutor} onChange={(e) => setNuevoTutor(e.target.value)} />
            <span className="forminsc-icono-lupa">
              <Search size={18} />
            </span>
            {nuevoTutor && tutoresFiltrados.length > 0 && (
              <ul className="forminsc-lista-sugerencias">
                {tutoresFiltrados
                  .filter((t) => t.nombre.toLowerCase().includes(nuevoTutor.toLowerCase()))
                  .slice(0, 5)
                  .map((t, index) => (
                    <li
                      key={index}
                      className="forminsc-sugerencia-item"
                      onClick={() => {
                        setNuevoTutor(t.nombre);
                        setRelacion(t.relacion);
                      }}
                    >
                      {t.nombre}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <select className="forminsc-select" value={relacion} onChange={(e) => setRelacion(e.target.value)}>
            <option value="">Relación</option>
            <option value="padre">Padre/Madre</option>
           
            <option value="profesor">Profesor/a</option>
          </select>
          <select className="forminsc-select" value={areaTutorSeleccionada} onChange={(e) => setAreaTutorSeleccionada(e.target.value)}>
            <option value="">Área del Tutor</option>
            {areasDisponibles.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
          </select>
          <button className="forminsc-boton-anadir" onClick={agregarTutor}>+ Añadir</button>
        </div>

        {errores.tutores && (
          <p className="forminsc-mensaje forminsc-mensaje-error">
            Debe seleccionar al menos un tutor.
          </p>
        )}

        {tutores.length > 0 && (
          <table className="forminsc-tabla-tutores">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Relación</th>
                <th>Área</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tutores.map((tutor, i) => (
                <tr key={i}>
                  <td>{tutor.nombre}</td>
                  <td>{tutor.correo}</td>
                  <td>{tutor.telefono}</td>
                  <td>{tutor.relacion}</td>
                  <td>{tutor.area}</td>
                  <td>
                    <button onClick={() => eliminarTutor(i)} className="forminsc-btn-eliminar-tutor">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="forminsc-mensaje">
          Puede seleccionar hasta 3 tutores. {3 - tutores.length} disponibles
        </p>
      </section>

      <div className="forminsc-finalizar-wrapper">
        <button className="forminsc-boton-finalizar" onClick={manejarEnvio}>
          Completar inscripción
        </button>
      </div>
    </div>
  );
};

export default FormularioInscripcion;