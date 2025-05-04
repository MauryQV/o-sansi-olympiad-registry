import { useEffect, useState } from 'react';

export const useReporteInscripciones = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  useEffect(() => {
    // Datos de prueba
    const mockInscripciones = [
      { id: 1, estudiante: 'Ana López', area: 'Robótica', categoria: 'Builders P', grado: '5to Primaria', fecha: '15/01/2025', estado: 'Pendiente' },
      { id: 2, estudiante: 'Carlos Pérez', area: 'Física', categoria: '6S', grado: '6to Secundaria', fecha: '16/01/2025', estado: 'Completado' },
      { id: 3, estudiante: 'María García', area: 'Biología', categoria: '2S', grado: '2do Secundaria', fecha: '17/01/2025', estado: 'Cancelado' },
      { id: 4, estudiante: 'Luis Rodríguez', area: 'Química', categoria: '4S', grado: '4to Secundaria', fecha: '18/01/2025', estado: 'Completado' },
      { id: 5, estudiante: 'Valeria Suárez', area: 'Robótica', categoria: 'Junior R', grado: '6to Primaria', fecha: '19/01/2025', estado: 'Pendiente' },
      { id: 6, estudiante: 'Pedro Mendoza', area: 'Física', categoria: '3S', grado: '3ro Secundaria', fecha: '20/01/2025', estado: 'Completado' },
      { id: 7, estudiante: 'Lucía Herrera', area: 'Biología', categoria: '1S', grado: '1ro Secundaria', fecha: '21/01/2025', estado: 'Pendiente' },
      { id: 8, estudiante: 'Daniel Castro', area: 'Química', categoria: '5S', grado: '5to Secundaria', fecha: '22/01/2025', estado: 'Cancelado' },
      { id: 9, estudiante: 'Ernesto Valdivia', area: 'Biología', categoria: '3S', grado: '3ro Secundaria', fecha: '23/01/2025', estado: 'Pendiente' },
      { id: 10, estudiante: 'Gabriela Chávez', area: 'Física', categoria: '4S', grado: '4to Secundaria', fecha: '24/01/2025', estado: 'Completado' },
      { id: 11, estudiante: 'Martín Salazar', area: 'Robótica', categoria: 'Builders S', grado: '6to Primaria', fecha: '25/01/2025', estado: 'Cancelado' },
      { id: 12, estudiante: 'Silvia Guzmán', area: 'Química', categoria: '5S', grado: '5to Secundaria', fecha: '26/01/2025', estado: 'Pendiente' }
    ];

    const mockAreas = [
      { id: 1, nombre: 'Robótica' },
      { id: 2, nombre: 'Biología' },
      { id: 3, nombre: 'Física' },
      { id: 4, nombre: 'Química' }
    ];

    setInscripciones(mockInscripciones);
    setAreas(mockAreas);
  }, []);

  const aplicarFiltrosManual = () => {
    setFiltrosAplicados(true);
    setCurrentPage(1);
  };

  const filtrar = () => {
    return inscripciones.filter(i =>
      (estadoFiltro === '' || i.estado === estadoFiltro) &&
      (areaFiltro === '' || i.area === areaFiltro)
    );
  };

  const limpiar = () => {
    setEstadoFiltro('');
    setAreaFiltro('');
    setFiltrosAplicados(false);
  };

  const datosFiltrados = filtrosAplicados ? filtrar() : inscripciones;
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
    datosFiltrados,
    datosPagina,
    limpiar,
    currentPage, setCurrentPage,
    totalPages,
    aplicarFiltrosManual,
    filtrosAplicados, setFiltrosAplicados
  };
};