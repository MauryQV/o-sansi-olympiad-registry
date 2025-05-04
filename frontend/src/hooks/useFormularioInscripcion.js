import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { tutorExiste, tutorYaAgregado } from '../forms/formularioInscripcionValidator';
import { 
  obtenerTutoresDisponibles, 
  buscarTutores, 
  registrarInscripcion, 
  obtenerInfoAcademica, 
  verificarPeriodoInscripcion 
} from '../services/inscripcionService';

export const useFormularioInscripcion = (convocatoriaId) => {
  const [area, setArea] = useState('');
  const [categoria, setCategoria] = useState('');
  const [grado, setGrado] = useState('');
  const [nivel, setNivel] = useState('');
  const [tutores, setTutores] = useState([]);
  const [nuevoTutor, setNuevoTutor] = useState('');
  const [areaTutorSeleccionada, setAreaTutorSeleccionada] = useState('');
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [periodoActivo, setPeriodoActivo] = useState(true);

  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [categoriasPorArea, setCategoriasPorArea] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
  const [tutoresDisponibles, setTutoresDisponibles] = useState([]);
  const [tutoresEncontrados, setTutoresEncontrados] = useState([]);

  // Verificar si el periodo de inscripción está activo
  useEffect(() => {
    const verificarPeriodo = async () => {
      try {
        const { activo } = await verificarPeriodoInscripcion(convocatoriaId);
        setPeriodoActivo(activo);
        
        if (!activo) {
          Swal.fire({
            icon: 'error',
            title: 'Periodo cerrado',
            text: 'El periodo de inscripción ha finalizado.'
          });
        }
      } catch (error) {
        console.error('Error verificando periodo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo verificar el periodo de inscripción.'
        });
      }
    };
    
    if (convocatoriaId) {
      verificarPeriodo();
    }
  }, [convocatoriaId]);

  // Cargar información académica
  useEffect(() => {
    const cargarInfoAcademica = async () => {
      try {
        setCargando(true);
        const data = await obtenerInfoAcademica(convocatoriaId);
        
        console.log("Datos recibidos:", data);
        
        if (!data || !data.areas || !data.grados || !data.niveles) {
          console.error('Estructura de datos académicos incorrecta:', data);
          throw new Error('La estructura de datos académicos es incorrecta');
        }
        
        // Extraer y procesar áreas
        const nombreAreas = data.areas.map(a => a.nombre_area);
        setAreasDisponibles(nombreAreas.length > 0 ? nombreAreas : []);
        console.log("Áreas disponibles:", nombreAreas);
        
        // Crear mapa de categorías por área
        const categoriasMap = {};
        data.areas.forEach(area => {
          if (area.categorias && Array.isArray(area.categorias)) {
            categoriasMap[area.nombre_area] = area.categorias.map(c => c.nombre_categoria);
          } else {
            categoriasMap[area.nombre_area] = [];
          }
        });
        setCategoriasPorArea(categoriasMap);
        console.log("Categorías por área:", categoriasMap);
        
        // Extraer grados y niveles
        const nombresGrados = data.grados.map(g => g.nombre_grado);
        const nombresNiveles = data.niveles.map(n => n.nombre_nivel);
        
        setGradosDisponibles(nombresGrados.length > 0 ? nombresGrados : []);
        setNivelesDisponibles(nombresNiveles.length > 0 ? nombresNiveles : []);
        
        console.log("Grados disponibles:", nombresGrados);
        console.log("Niveles disponibles:", nombresNiveles);
      } catch (error) {
        console.error('Error cargando información académica:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información académica.'
        });
      } finally {
        setCargando(false);
      }
    };
    
    if (convocatoriaId && periodoActivo) {
      cargarInfoAcademica();
    }
  }, [convocatoriaId, periodoActivo]);

  // Cargar tutores disponibles
  useEffect(() => {
    const cargarTutores = async () => {
      try {
        const tutores = await obtenerTutoresDisponibles();
        console.log("Tutores disponibles:", tutores);
        setTutoresDisponibles(tutores);
      } catch (error) {
        console.error('Error cargando tutores:', error);
      }
    };
    
    if (periodoActivo) {
      cargarTutores();
    }
  }, [periodoActivo]);

  // Actualizar categorías disponibles cuando cambia el área
  useEffect(() => {
    if (area && categoriasPorArea[area]) {
      setCategoriasDisponibles(categoriasPorArea[area]);
      console.log("Categorías actualizadas para área", area, ":", categoriasPorArea[area]);
    } else {
      setCategoriasDisponibles([]);
      console.log("No hay categorías disponibles para el área:", area);
    }
  }, [area, categoriasPorArea]);

  // Buscar tutores cuando cambia el texto de búsqueda
  useEffect(() => {
    const buscarTutoresAsync = async () => {
      if (nuevoTutor.length >= 3) {
        try {
          console.log("Buscando tutores:", nuevoTutor, areaTutorSeleccionada);
          const tutoresEncontrados = await buscarTutores(nuevoTutor, areaTutorSeleccionada || null);
          console.log("Tutores encontrados:", tutoresEncontrados);
          setTutoresEncontrados(tutoresEncontrados);
        } catch (error) {
          console.error('Error buscando tutores:', error);
          setTutoresEncontrados([]);
        }
      } else {
        setTutoresEncontrados([]);
      }
    };
    
    buscarTutoresAsync();
  }, [nuevoTutor, areaTutorSeleccionada]);

  const agregarTutor = () => {
    if (nuevoTutor && tutores.length < 3) {
      // Buscar el tutor en los resultados encontrados (puede haber o no un área seleccionada)
      const tutorEncontrado = tutoresEncontrados.find(t => 
        t.nombre === nuevoTutor && 
        (!areaTutorSeleccionada || t.area === areaTutorSeleccionada)
      );
      
      const duplicado = tutores.some(t => t.id === (tutorEncontrado?.id || ''));

      if (!tutorEncontrado) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Tutor no válido', 
          text: 'El tutor no está registrado o no coincide con el área seleccionada.' 
        });
      } else if (duplicado) {
        Swal.fire({ 
          icon: 'warning', 
          title: 'Tutor duplicado', 
          text: 'Este tutor ya fue añadido.' 
        });
      } else {
        setTutores([...tutores, tutorEncontrado]);
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

  const manejarEnvio = async () => {
    if (!periodoActivo) {
      Swal.fire({
        icon: 'error',
        title: 'Periodo cerrado',
        text: 'El periodo de inscripción ha finalizado.'
      });
      return;
    }
    
    if (validarFormulario()) {
      try {
        setCargando(true);
        
        // Buscar el ID del área seleccionada
        const areaSeleccionada = await obtenerInfoAcademica(convocatoriaId);
        const areaId = areaSeleccionada.areas.find(a => a.nombre_area === area)?.id;
        
        if (!areaId) {
          throw new Error('No se pudo obtener el ID del área seleccionada');
        }
        
        const datosInscripcion = {
          convocatoria_id: convocatoriaId,
          area_id: areaId,
          grado,
          nivel,
          tutores: tutores.map(t => t.id)
        };
        
        console.log("Enviando datos de inscripción:", datosInscripcion);
        
        const resultado = await registrarInscripcion(datosInscripcion);
        
        Swal.fire({ 
          icon: 'success', 
          title: '¡Registro exitoso!',
          text: `¡Inscripción exitosa! Se ha vinculado a ${tutores.length} tutor(es) en el área ${area}.`
        });
        
        // Limpiar formulario
        setArea('');
        setCategoria('');
        setGrado('');
        setNivel('');
        setTutores([]);
        setErrores({});
      } catch (error) {
        console.error('Error en inscripción:', error);
        Swal.fire({ 
          icon: 'error', 
          title: 'Error en la inscripción',
          text: error.message
        });
      } finally {
        setCargando(false);
      }
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: 'Campos incompletos',
        text: 'Debe seleccionar el área, categoría, grado académico y al menos un tutor.'
      });
    }
  };

  return {
    area, categoria, grado, nivel, tutores, nuevoTutor, areaTutorSeleccionada, errores, cargando, periodoActivo,
    areasDisponibles, categoriasDisponibles, gradosDisponibles, nivelesDisponibles,
    setArea, setCategoria, setGrado, setNivel, setNuevoTutor, setAreaTutorSeleccionada,
    agregarTutor, eliminarTutor, manejarEnvio, tutoresEncontrados
  };
};
