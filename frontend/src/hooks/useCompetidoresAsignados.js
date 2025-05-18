import { useState, useEffect } from 'react';
import { obtenerCompetidoresAsignados } from '../services/tutorService';

export const useCompetidoresAsignados = () => {
  const [competidores, setCompetidores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [actualizado, setActualizado] = useState(false);

  useEffect(() => {
    const cargarCompetidores = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerCompetidoresAsignados();
        setCompetidores(data || []);
      } catch (error) {
        console.error('Error al cargar competidores:', error);
        setError('No se pudieron cargar los competidores asignados. Por favor, intenta de nuevo.');
      } finally {
        setCargando(false);
      }
    };

    cargarCompetidores();
  }, [actualizado]);

  const actualizarCompetidores = () => {
    setActualizado(prev => !prev);
  };

  return {
    competidores,
    cargando,
    error,
    actualizarCompetidores
  };
}; 