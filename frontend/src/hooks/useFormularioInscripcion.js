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
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
  const [todosLosGrados, setTodosLosGrados] = useState([]);
  const [gradosFiltrados, setGradosFiltrados] = useState([]);
  const [cargandoGrados, setCargandoGrados] = useState(false);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const data = await competidorInscripcion.obtenerAreas();
        setAreasDisponibles(data);
      } catch (error) {
        console.error('error para cargar las areas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las áreas disponibles'
        });
      }
    };

    cargarAreas();
  }, []);

  // Efecto para limpiar tutores cuando cambia el área
  useEffect(() => {
    setTutores([]);
  }, [area]);

  useEffect(() => {
    const cargarCategorias = async () => {
      if (area) {
        setCargandoCategorias(true);
        try {
          const data = await competidorInscripcion.obtenerCategorias(area);
          if (data && data.length > 0) {
            setCategoriasDisponibles(data);
          } else {
            setCategoriasDisponibles([]);
            Swal.fire({
              icon: 'info',
              title: 'Sin categorías',
              text: 'No hay categorías disponibles para esta área'
            });
          }
          setCategoria('');
          setGrado('');
          setNivel('');
        } catch (error) {
          console.error('Error al cargar categorías:', error);
          setCategoriasDisponibles([]);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudieron cargar las categorías del área seleccionada'
          });
        } finally {
          setCargandoCategorias(false);
        }
      } else {
        setCategoriasDisponibles([]);
        setCategoria('');
        setGrado('');
        setNivel('');
      }
    };

    cargarCategorias();
  }, [area]);

  useEffect(() => {
    const cargarGrados = async () => {
      if (categoria) {
        setCargandoGrados(true);
        try {
          const data = await competidorInscripcion.obtenerGrados(categoria);
          console.log('Datos de grados recibidos:', data);

          if (data && data.grados && Array.isArray(data.grados)) {
            setNivelesDisponibles(data.niveles || []);
            setNivel('');

            const gradosOrdenados = data.grados.sort((a, b) => {
              if (a.nivel !== b.nivel) {
                return a.nivel === 'Primaria' ? -1 : 1;
              }
              return parseInt(a.nombre_grado) - parseInt(b.nombre_grado);
            });

            setTodosLosGrados(gradosOrdenados);
            setGradosFiltrados(gradosOrdenados);
          } else {
            setTodosLosGrados([]);
            setGradosFiltrados([]);
            setNivelesDisponibles([]);
          }

          setGrado('');
        } catch (error) {
          console.error('Error al cargar grados para la categoría:', error);
          setTodosLosGrados([]);
          setGradosFiltrados([]);
          setNivelesDisponibles([]);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los grados disponibles'
          });
        } finally {
          setCargandoGrados(false);
        }
      } else {
        setTodosLosGrados([]);
        setGradosFiltrados([]);
        setNivelesDisponibles([]);
        setGrado('');
        setNivel('');
      }
    };

    cargarGrados();
  }, [categoria]);

  useEffect(() => {
    if (nivel) {
      const filtrados = todosLosGrados.filter(g => g.nivel === nivel);
      setGradosFiltrados(filtrados);
      setGrado('');
    } else {
      setGradosFiltrados(todosLosGrados);
    }
  }, [nivel, todosLosGrados]);

  const agregarTutor = (tutor) => {
    if (tutor && area && tutores.length < 3) {
      const duplicado = tutores.find(t => t.id === tutor.id);

      if (duplicado) {
        Swal.fire({ icon: 'warning', title: 'Tutor duplicado', text: 'Este tutor ya fue añadido.' });
      } else {
        setTutores([...tutores, { ...tutor, relacion: 'tutor' }]);
        setMostrarModal(false);
      }
    } else if (!tutor) {
      Swal.fire({ icon: 'error', title: 'Tutor no válido', text: 'Debe seleccionar un tutor válido.' });
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
    if (tutores.length === 0) nuevos.tutores = true;
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const manejarEnvio = async () => {
    if (validarFormulario()) {
      try {
        const resultado = await competidorInscripcion.registrarInscripcion({
          area_id: parseInt(area),
          categoria_id: parseInt(categoria),
          grado_id: parseInt(grado),
          tutor_ids: tutores.map(t => t.id)
        });

        Swal.fire({
          icon: 'success',
          title: 'Inscripción completada',
          text: resultado.mensaje || 'Se ha registrado correctamente'
        });

        setArea('');
        setCategoria('');
        setGrado('');
        setNivel('');
        setTutores([]);
        setErrores({});
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.response?.data?.error || 'Ocurrió un error inesperado'
        });
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Campos incompletos' });
    }
  };

  return {
    area, categoria, grado, nivel, tutores, nuevoTutor, errores, mostrarModal,
    areasDisponibles, categoriasDisponibles, gradosFiltrados, nivelesDisponibles,
    cargandoGrados, cargandoCategorias,
    setArea, setCategoria, setGrado, setNivel, setMostrarModal,
    setNuevoTutor, agregarTutor, eliminarTutor, manejarEnvio
  };
};