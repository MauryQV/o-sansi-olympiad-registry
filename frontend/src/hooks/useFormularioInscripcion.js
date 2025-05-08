import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { tutorExiste, tutorYaAgregado } from '../forms/formularioInscripcionValidator';
import * as competidorInscripcion from '../services/competidorInscripcion';

export const useFormularioInscripcion = () => {
  const [area, setArea] = useState('');
  const [categoria, setCategoria] = useState('');
  const [grado, setGrado] = useState('');
  const [nivel, setNivel] = useState('');
  const [tutores, setTutores] = useState([]);
  const [nuevoTutor, setNuevoTutor] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errores, setErrores] = useState({});
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [categoriasPorArea, setCategoriasPorArea] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
  const [tutoresDisponibles, setTutoresDisponibles] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const data = await competidorInscripcion.obtenerAreas();
        setAreasDisponibles(data); // ahora es un array de objetos: [{ id, nombre }]
      } catch (error) {
        console.error('error para cargar las areas:', error);
      }
    };

    cargarAreas();
  }, []);

  const buscarTutores = async () => {
    try {
      const data = await obtenerTutores(areaSeleccionada, busqueda);
      setResultados(data);
    } catch (error) {
      console.error('Error al buscar tutores:', error);
    }
  };

  useEffect(() => {
    const cargarCategorias = async () => {
      if (area) {
        try {
          const data = await competidorInscripcion.obtenerCategoriasArea(area);
          const categorias = data.map(c => ({
            id: c.categoria.id,
            nombre: c.categoria.nombre_categoria,
          }));
          setCategoriasDisponibles(categorias);
        } catch (error) {
          console.error('Error al cargar categorias por areas :,v', error);
          setCategoriasDisponibles([]);
        }
      }
    };

    cargarCategorias();
  }, [area]);


  useEffect(() => {

    setGradosDisponibles(['1°', '2°', '3°', '4°', '5°', '6°']);

    setNivelesDisponibles(['Primaria', 'Secundaria']);

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

  }, []);

  useEffect(() => {
    const cargarTutores = async () => {
      if (area) {
        try {
          const data = await competidorInscripcion.obtenerTutores(area, ''); // sin nombre, carga todos los tutores del área
          setTutoresDisponibles(data);
        } catch (error) {
          console.error('Error al cargar tutores del área:', error);
          setTutoresDisponibles([]);
        }
      }
    };

    cargarTutores();
  }, [area]);

  useEffect(() => {
    setCategoriasDisponibles(categoriasPorArea[area] || []);
  }, [area, categoriasPorArea]);

  const agregarTutor = () => {
    if (nuevoTutor && area && tutores.length < 3) {
      const tutor = tutoresDisponibles.find(t => t.nombre_completo === nuevoTutor);
      const duplicado = tutores.find(t => t.id === tutor?.id);

      if (!tutor) {
        Swal.fire({ icon: 'error', title: 'Tutor no válido', text: 'Debe seleccionar un tutor válido.' });
      } else if (duplicado) {
        Swal.fire({ icon: 'warning', title: 'Tutor duplicado', text: 'Este tutor ya fue añadido.' });
      } else {
        setTutores([...tutores, { ...tutor, relacion: 'tutor' }]);
        setNuevoTutor('');
        setMostrarModal(false);
      }
    }
  };

  const eliminarTutor = (index) => {
    const copia = [...tutores];
    copia.splice(index, 1);
    setTutores(copia);
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

  const tutoresFiltrados = tutoresDisponibles.filter(t => t.area === area);

  return {
    area, categoria, grado, nivel, tutores, nuevoTutor, errores, mostrarModal,
    areasDisponibles, categoriasDisponibles, gradosDisponibles, nivelesDisponibles, tutoresDisponibles,
    setArea, setCategoria, setGrado, setNivel, setNuevoTutor, setMostrarModal,
    agregarTutor, eliminarTutor, manejarEnvio, tutoresFiltrados
  };
};