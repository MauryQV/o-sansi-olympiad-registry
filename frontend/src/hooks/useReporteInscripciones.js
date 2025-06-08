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
        
        // Eliminar duplicados basándose en nombres similares (insensitive a mayúsculas)
        const areasUnicas = [];
        const nombresVistos = new Set();
        
        areasFormateadas.forEach(area => {
          const nombreNormalizado = area.nombre.toLowerCase();
          
          // Verificar si ya existe una variación de este nombre
          let yaExiste = false;
          for (let nombreVisto of nombresVistos) {
            if (nombreVisto === nombreNormalizado || 
                (nombreVisto.includes('biolog') && nombreNormalizado.includes('biolog')) ||
                (nombreVisto.includes('quím') && nombreNormalizado.includes('quím')) ||
                (nombreVisto.includes('matemát') && nombreNormalizado.includes('matemát'))) {
              yaExiste = true;
              break;
            }
          }
          
          if (!yaExiste) {
            areasUnicas.push(area);
            nombresVistos.add(nombreNormalizado);
          }
        });
        
        setAreas(areasUnicas);
      } catch (error) {
        // console.error('Error al cargar áreas:', error);
        setError('Error al cargar áreas');
        // En caso de error, usar un arreglo vacío
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
    
    // Usar parámetros si se proporcionan, sino usar estados actuales
    const estadoAUsar = estadoParametro !== null ? estadoParametro : estadoFiltro;
    const areaAUsar = areaParametro !== null ? areaParametro : areaFiltro;
    
    // Ejecutar la búsqueda inmediatamente con los filtros actuales
    setCargando(true);
    setError(null);

    try {
      console.log("=== APLICAR FILTROS MANUAL ===");
      console.log("estadoAUsar:", estadoAUsar, "tipo:", typeof estadoAUsar, "length:", estadoAUsar?.length);
      console.log("areaAUsar:", areaAUsar, "tipo:", typeof areaAUsar, "length:", areaAUsar?.length);
      console.log("Parámetros recibidos - estado:", estadoParametro, "área:", areaParametro);
      
      const filtros = {};

      if (estadoAUsar && estadoAUsar.trim() !== '') {
        filtros.estado = estadoAUsar;
        console.log("Agregando filtro estado:", estadoAUsar);
      } else {
        console.log("NO agregando filtro estado - valor vacío o undefined");
      }
      
      if (areaAUsar && areaAUsar.trim() !== '') {
        filtros.area = areaAUsar;
        console.log("Agregando filtro área:", areaAUsar);
      } else {
        console.log("NO agregando filtro área - valor vacío o undefined");
      }
      
      console.log("Objeto filtros final:", filtros);
      console.log("Keys del objeto filtros:", Object.keys(filtros));
      console.log("Enviando filtros al backend:", filtros);
      

      if (estadoFiltro) filtros.estado = estadoFiltro;
      if (areaFiltro) filtros.area = areaFiltro;

      //console.log("Enviando filtros al backend:", filtros);


      const respuesta = await obtenerReportePostulantes(filtros);
      //console.log("Datos recibidos del backend:", respuesta);

      setInscripciones(respuesta.postulantes || []);
    } catch (error) {
      //console.error('Error al cargar datos:', error);
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
