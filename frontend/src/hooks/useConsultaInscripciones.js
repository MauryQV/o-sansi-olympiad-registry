import { useState, useEffect } from 'react';
import { obtenerMisInscripciones } from '../services/competidorInscripcion';

export const useConsultaInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [actualizado, setActualizado] = useState(false);

  useEffect(() => {
    const cargarInscripciones = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerMisInscripciones();
        setInscripciones(data || []);
      } catch (error) {
        console.error('Error al cargar inscripciones:', error);
        setError('No se pudieron cargar las inscripciones. Por favor, intenta de nuevo.');
      } finally {
        setCargando(false);
      }
    };

    cargarInscripciones();
  }, [actualizado]);

  const actualizarInscripciones = () => {
    setActualizado(prev => !prev);
  };

  return {
    inscripciones,
    cargando,
    error,
    actualizarInscripciones
  };
}; 