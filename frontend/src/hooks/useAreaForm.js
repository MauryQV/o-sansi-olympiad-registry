import { useEffect, useState } from 'react';

export const useAreaForm = (mostrar, areaAEditar) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (!mostrar) return;

        if (areaAEditar) {
            setNombre(areaAEditar.nombre || '');
            setDescripcion(areaAEditar.descripcion || '');
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

        if (!nombre.trim()) {
            nuevosErrores.nombre = 'El nombre del área es obligatorio.';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/.test(nombre)) {
            nuevosErrores.nombre = 'Solo se permiten letras y espacios (3-50 caracteres).';
        }

        if (!descripcion.trim()) {
            nuevosErrores.descripcion = 'La descripción es obligatoria.';
        } else if (descripcion.length < 10 || descripcion.length > 100) {
            nuevosErrores.descripcion = 'Debe tener entre 10 y 100 caracteres.';
        }

        if (!costo.trim()) {
            nuevosErrores.costo = 'El costo es obligatorio.';
        } else if (!/^\d+$/.test(costo)) {
            nuevosErrores.costo = 'Solo se permiten números.';
        } else if (+costo < 10 || +costo > 30) {
            nuevosErrores.costo = 'El costo debe estar entre 10 y 30 Bs.';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const getData = () => ({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        costo: parseInt(costo)
    });

    const handlers = {
        onNombre: (e) => setNombre(e.target.value),
        onDescripcion: (e) => setDescripcion(e.target.value),
        onCosto: (e) => setCosto(e.target.value),
        bloquearTexto: (e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); },
        soloLetras: (e) => { if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ\s]/.test(e.key)) e.preventDefault(); }
    };

    return { nombre, descripcion, costo, errores, validar, getData, ...handlers };
};
