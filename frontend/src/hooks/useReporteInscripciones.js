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
        const areasSimples = areasData.map(area => ({
          id: area.id,
          nombre: area.nombre_area
        }));
        setAreas(areasSimples);
      } catch (error) {
        setError('Error al cargar áreas');
        setAreas([]);
      }
    };

    cargarAreas();
  }, []);

  // Ya no necesitamos este useEffect porque aplicarFiltrosManual maneja la carga directamente
  // useEffect removido para evitar cargas duplicadas

  const aplicarFiltrosManual = async (estadoParametro = null, areaParametro = null) => {
    setFiltrosAplicados(true);
    setCurrentPage(1);

    // Usa el parámetro si viene, si no, el valor actual del filtro
    const estadoAUsar = estadoParametro !== null ? estadoParametro : estadoFiltro;
    const areaAUsar = areaParametro !== null ? areaParametro : areaFiltro;

    setCargando(true);
    setError(null);

    try {
      const filtros = {};
      if (estadoAUsar && estadoAUsar.trim() !== '') {
        filtros.estado = estadoAUsar;
        // console.log("Agregando filtro estado:", estadoAUsar);
      }
      if (areaAUsar && areaAUsar.trim() !== '') {
        filtros.area = areaAUsar;
        // console.log("Agregando filtro área:", areaAUsar);
      }

      const respuesta = await obtenerReportePostulantes(filtros);
      setInscripciones(respuesta.postulantes || []);
    } catch (error) {
      setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
      setInscripciones([]);
    } finally {
      setCargando(false);
    }
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
