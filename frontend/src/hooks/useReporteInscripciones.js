import { useEffect, useState } from 'react';
import { obtenerReportePostulantes } from '../services/reporteService';
import { getAreas } from '../services/areaService';

export const useReporteInscripciones = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  // Cargar áreas al montar el componente
  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const areasData = await getAreas();
        console.log('Áreas cargadas desde el backend:', areasData);
        
        // Transformar los datos para que tengan la estructura esperada por el componente
        const areasFormateadas = areasData.map(area => ({
          id: area.id,
          nombre: area.nombre_area
        }));
        
        setAreas(areasFormateadas);
      } catch (error) {
        console.error('Error al cargar áreas:', error);
        setError('Error al cargar áreas');
        // En caso de error, usar un arreglo vacío
        setAreas([]);
      }
    };

    cargarAreas();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (filtrosAplicados) {
      cargarDatos();
    }
  }, [filtrosAplicados]);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const filtros = {};
      if (estadoFiltro) filtros.estado = estadoFiltro;
      if (areaFiltro) filtros.area = areaFiltro;
      
      console.log("Enviando filtros al backend:", filtros);
      
      const respuesta = await obtenerReportePostulantes(filtros);
      console.log("Datos recibidos del backend:", respuesta);
      
      setInscripciones(respuesta.postulantes || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
      setInscripciones([]);
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltrosManual = () => {
    setFiltrosAplicados(true);
    setCurrentPage(1);
  };

  const limpiar = () => {
    setEstadoFiltro('');
    setAreaFiltro('');
    setFiltrosAplicados(false);
    setInscripciones([]);
  };

  const datosFiltrados = inscripciones;
  const totalPages = Math.ceil(datosFiltrados.length / itemsPerPage);
  const datosPagina = datosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    estadoFiltro, setEstadoFiltro,
    areaFiltro, setAreaFiltro,
    inscripciones,
    areas,
    cargando,
    error,
    datosFiltrados,
    datosPagina,
    limpiar,
    currentPage, setCurrentPage,
    totalPages,
    aplicarFiltrosManual,
    filtrosAplicados, setFiltrosAplicados
  };
};
