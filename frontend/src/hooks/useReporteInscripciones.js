import { useEffect, useState } from 'react';
import { obtenerReportePostulantes } from '../services/reporteService';

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
        // Aquí podrías usar un servicio para cargar las áreas desde el backend
        // Por ahora usamos datos mock
        const mockAreas = [
          { id: 1, nombre: 'Robótica' },
          { id: 2, nombre: 'Física' },
          { id: 3, nombre: 'Matemáticas' }
        ];
        setAreas(mockAreas);
      } catch (error) {
        console.error('Error al cargar áreas:', error);
        setError('Error al cargar áreas');
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
