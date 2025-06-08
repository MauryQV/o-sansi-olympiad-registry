import { useState } from 'react';

export const useBuscadorAreas = (areasIniciales = []) => {
    const [criterio, setCriterio] = useState('nombre');
    const [termino, setTermino] = useState('');
    const [areas, setAreas] = useState(areasIniciales);
    const [areasOriginal, setAreasOriginal] = useState(areasIniciales);

    const handleBuscar = () => {
        const t = termino.trim().toLowerCase();
        const filtradas = areasOriginal.filter((area) => {
            if (criterio === 'nombre') {
                return area.nombre_area.toLowerCase().includes(t);
            }
            if (criterio === 'costo') {
                const costoArea = parseFloat(area.costo);
                const costoTermino = parseFloat(t);
                if (isNaN(costoTermino)) return true;
                return costoArea === costoTermino;
            }
            return false;
        });
        setAreas(filtradas);
    };

    const handleResetear = () => {
        setTermino('');
        setAreas(areasOriginal);
    };

    const actualizarAreas = (nuevasAreas) => {
        setAreas(nuevasAreas);
        setAreasOriginal(nuevasAreas);
    };

    return {
        criterio, setCriterio,
        termino, setTermino,
        areas, actualizarAreas,
        handleBuscar, handleResetear
    };
}; 