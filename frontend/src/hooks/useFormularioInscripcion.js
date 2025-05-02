import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { tutorExiste, tutorYaAgregado } from '../forms/formularioInscripcionValidator';

export const useFormularioInscripcion = () => {
  const [area, setArea] = useState('');
  const [categoria, setCategoria] = useState('');
  const [grado, setGrado] = useState('');
  const [nivel, setNivel] = useState('');
  const [tutores, setTutores] = useState([]);
  const [nuevoTutor, setNuevoTutor] = useState('');
  const [areaTutorSeleccionada, setAreaTutorSeleccionada] = useState('');
  const [errores, setErrores] = useState({});

  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [categoriasPorArea, setCategoriasPorArea] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
  const [tutoresDisponibles, setTutoresDisponibles] = useState([]);

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
      { nombre: 'Ana Martínez', correo: 'ana1@mail.com', telefono: '70123456', area: 'Biología' },
      { nombre: 'Carlos Ramírez', correo: 'carlos@mail.com', telefono: '78912345', area: 'Física' },
      { nombre: 'Luisa Gómez', correo: 'luisa@mail.com', telefono: '71234567', area: 'Matemática' },
      { nombre: 'Pedro López', correo: 'pedro@mail.com', telefono: '73456789', area: 'Robótica' },
    ]);
  }, []);

  useEffect(() => {
    setCategoriasDisponibles(categoriasPorArea[area] || []);
  }, [area, categoriasPorArea]);

  const agregarTutor = () => {
    if (nuevoTutor && areaTutorSeleccionada && tutores.length < 3) {
      const tutor = tutorExiste(tutoresDisponibles, nuevoTutor, areaTutorSeleccionada);
      const duplicado = tutorYaAgregado(tutores, nuevoTutor, areaTutorSeleccionada);

      if (!tutor) {
        Swal.fire({ icon: 'error', title: 'Tutor no válido', text: 'Debe seleccionar un tutor existente.' });
      } else if (duplicado) {
        Swal.fire({ icon: 'warning', title: 'Tutor duplicado', text: 'Este tutor ya fue añadido.' });
      } else {
        setTutores([...tutores, tutor]);
        setNuevoTutor('');
        setAreaTutorSeleccionada('');
      }
    }
  };

  const eliminarTutor = (index) => {
    const copia = [...tutores];
    copia.splice(index, 1);
    setTutores(copia);
  };

  const validarFormulario = () => {
    const nuevos = {};
    if (!area) nuevos.area = true;
    if (!categoria) nuevos.categoria = true;
    if (!grado) nuevos.grado = true;
    if (!nivel) nuevos.nivel = true;
    if (tutores.length === 0) nuevos.tutores = true;
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const manejarEnvio = () => {
    if (validarFormulario()) {
      Swal.fire({ icon: 'success', title: '¡Registro exitoso!' });
      setArea(''); setCategoria(''); setGrado(''); setNivel('');
      setTutores([]); setErrores({});
    } else {
      Swal.fire({ icon: 'error', title: 'Campos incompletos' });
    }
  };

  const tutoresFiltrados = tutoresDisponibles.filter(t => t.area === areaTutorSeleccionada);

  return {
    area, categoria, grado, nivel, tutores, nuevoTutor, areaTutorSeleccionada, errores,
    areasDisponibles, categoriasDisponibles, gradosDisponibles, nivelesDisponibles, tutoresDisponibles,
    setArea, setCategoria, setGrado, setNivel, setNuevoTutor, setAreaTutorSeleccionada,
    agregarTutor, eliminarTutor, manejarEnvio, tutoresFiltrados
  };
};
