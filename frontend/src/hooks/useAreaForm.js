import { useEffect, useState } from 'react';

export const useAreaForm = (mostrar, areaAEditar, areasExistentes = []) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (!mostrar) return;

        if (areaAEditar) {
            setNombre(areaAEditar.nombre_area || '');
            setDescripcion(areaAEditar.descripcion_area || '');
            setCosto(areaAEditar.costo?.toString() || '');
        } else {
            setNombre('');
            setDescripcion('');
            setCosto('');
        }
        setErrores({});
    }, [mostrar, areaAEditar]);

    const validar = () => {
        const nuevosErrores = {};
        const nombreTrimmed = nombre.trim();
        const costoTrimmed = costo.trim();

        if (!nombreTrimmed) {
            nuevosErrores.nombre = 'El nombre del área es obligatorio.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/.test(nombreTrimmed)) {
            nuevosErrores.nombre = 'Solo se permiten letras y espacios (3-50 caracteres).';
        } else {
            const nombreNormalizado = nombreTrimmed.toLowerCase();
            const esDuplicado = areasExistentes.some(
                area => area.nombre_area.trim().toLowerCase() === nombreNormalizado &&
                    (!areaAEditar || area.id !== areaAEditar.id)
            );
            if (esDuplicado) {
                nuevosErrores.nombre = "Ya existe un área con ese nombre. Por favor, elige otro.";
            }
        }

        if (!descripcion.trim()) {
            nuevosErrores.descripcion = 'La descripción es obligatoria.';
        } else if (descripcion.trim().length < 10 || descripcion.trim().length > 100) {
            nuevosErrores.descripcion = 'Debe tener entre 10 y 100 caracteres.';
        }

        if (!costoTrimmed) {
            nuevosErrores.costo = 'El costo es obligatorio.';
        } else if (!/^[0-9.]+$/.test(costoTrimmed)) {
            nuevosErrores.costo = 'El costo debe ser un número válido (ej. 25 o 25.50).';
        } else {
            const costoNumerico = parseFloat(costoTrimmed);
            if (costoNumerico < 15) {
                nuevosErrores.costo = 'El costo debe ser mayor o igual a 15 Bs.';
            } else if (costoNumerico > 10000) {
                nuevosErrores.costo = 'El costo no puede ser mayor a 10,000 Bs.';
            }
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const getData = () => ({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        costo: parseFloat(costo.trim())
    });

    const handlers = {
        onNombre: (e) => setNombre(e.target.value),
        onDescripcion: (e) => setDescripcion(e.target.value),
        onCosto: (e) => setCosto(e.target.value),
        bloquearTexto: (e) => { if (!/[0-9.]/.test(e.key)) e.preventDefault(); },
        soloLetras: (e) => { if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ\s]/.test(e.key)) e.preventDefault(); }
    };

    return { nombre, descripcion, costo, errores, validar, getData, ...handlers };
};