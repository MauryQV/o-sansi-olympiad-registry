import { useState, useEffect } from 'react';
import { validarCampos } from '../utils/validacionCategoria';

const useCategoriaForm = (categoriaAEditar, areaSeleccionada, onCrearCategoria, onActualizarCategoria, cerrar) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [gradosPrimaria, setGradosPrimaria] = useState([]);
    const [gradosSecundaria, setGradosSecundaria] = useState([]);
    const [areaSeleccionadaInterna, setAreaSeleccionada] = useState(areaSeleccionada || '');
    const [errores, setErrores] = useState({});
    const [grados, setGrados] = useState([]);
    const [gradosSeleccionados, setGradosSeleccionados] = useState([]);

    // Carga los grados disponibles
    useEffect(() => {
        fetch('http://localhost:7777/api/ver-grados')
            .then(res => res.json())
            .then(setGrados)
            .catch(err => console.error('Error al cargar grados:', err));
    }, []);

    // Establece los valores iniciales si hay una categoría para editar
    useEffect(() => {
        if (categoriaAEditar) {
            setNombre(categoriaAEditar.nombre);
            setDescripcion(categoriaAEditar.descripcion);
            setGradosPrimaria(categoriaAEditar.gradosPrimaria || []);
            setGradosSecundaria(categoriaAEditar.gradosSecundaria || []);
            setAreaSeleccionada(categoriaAEditar.area);
            // Establecer grados seleccionados basados en grados primaria y secundaria
            const todosGradosSeleccionados = [...(categoriaAEditar.gradosPrimaria || []), ...(categoriaAEditar.gradosSecundaria || [])];
            setGradosSeleccionados(todosGradosSeleccionados);
        } else if (areaSeleccionada) {
            setAreaSeleccionada(areaSeleccionada);
        }
        setErrores({});
    }, [categoriaAEditar, areaSeleccionada]);

    const toggleGrado = (gradoId) => {
        setGradosSeleccionados(prev =>
            prev.includes(gradoId)
                ? prev.filter(id => id !== gradoId)
                : [...prev, gradoId]
        );

        // Actualizar gradosPrimaria y gradosSecundaria basado en la selección
        const primaria = grados.filter(g => g.nivel.nombre_nivel === 'Primaria');
        const secundaria = grados.filter(g => g.nivel.nombre_nivel === 'Secundaria');

        const esPrimaria = primaria.some(grado => grado.id === gradoId);
        const esSecundaria = secundaria.some(grado => grado.id === gradoId);

        if (esPrimaria) {
            if (gradosPrimaria.includes(gradoId)) {
                setGradosPrimaria(prev => prev.filter(id => id !== gradoId));
            } else {
                setGradosPrimaria(prev => [...prev, gradoId]);
            }
        }

        if (esSecundaria) {
            if (gradosSecundaria.includes(gradoId)) {
                setGradosSecundaria(prev => prev.filter(id => id !== gradoId));
            } else {
                setGradosSecundaria(prev => [...prev, gradoId]);
            }
        }
    };

    const enviarFormulario = (e) => {
        e.preventDefault();

        const resultadoValidacion = validarCampos({
            nombre,
            descripcion,
            areaSeleccionadaInterna,
            gradosPrimaria,
            gradosSecundaria
        });

        if (!resultadoValidacion.esValido) {
            setErrores(resultadoValidacion.errores);
            return;
        }

        const nuevaCategoria = {
            nombre,
            descripcion,
            area: areaSeleccionadaInterna,
            gradosPrimaria,
            gradosSecundaria,
        };

        if (categoriaAEditar) {
            onActualizarCategoria(nuevaCategoria);
        } else {
            onCrearCategoria(nuevaCategoria);
        }

        cerrar();
        limpiarFormulario();
    };

    const limpiarFormulario = () => {
        setNombre('');
        setDescripcion('');
        setGradosPrimaria([]);
        setGradosSecundaria([]);
        setErrores({});
        setAreaSeleccionada(areaSeleccionada || '');
        setGradosSeleccionados([]);
    };

    return {
        nombre,
        setNombre,
        descripcion,
        setDescripcion,
        areaSeleccionadaInterna,
        setAreaSeleccionada,
        grados,
        gradosSeleccionados,
        errores,
        toggleGrado,
        enviarFormulario,
        limpiarFormulario
    };
};

export default useCategoriaForm;