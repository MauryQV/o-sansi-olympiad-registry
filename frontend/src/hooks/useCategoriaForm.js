import { useState, useEffect } from 'react';
import { validarCampos } from '../utils/validacionCategoria';

const useCategoriaForm = (
    categoriaAEditar, 
    areaSeleccionada, 
    onCrearCategoria, 
    onActualizarCategoria, 
    cerrar,
    categoriasExistentes = [],
    todasLasRelaciones = []
) => {
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

    useEffect(() => {
        if (categoriaAEditar) {
            setNombre(categoriaAEditar.nombre_categoria || '');
            setDescripcion(categoriaAEditar.descripcion_cat || '');
            
            setAreaSeleccionada(areaSeleccionada || ''); 

            if (grados && grados.length > 0 && categoriaAEditar.grado_min_id != null && categoriaAEditar.grado_max_id != null) {
                const minId = parseInt(categoriaAEditar.grado_min_id, 10);
                const maxId = parseInt(categoriaAEditar.grado_max_id, 10);
                const preSelected = grados
                    .filter(g => g.id >= minId && g.id <= maxId)
                    .map(g => ({ id: g.id, nombre_grado: g.nombre_grado, nivel: g.nivel.nombre_nivel }));
                setGradosSeleccionados(preSelected);
            } else {
                setGradosSeleccionados([]); 
            }

            setGradosPrimaria([]); 
            setGradosSecundaria([]);

        } else { 
            limpiarFormulario(); 
            if (areaSeleccionada) { 
                setAreaSeleccionada(areaSeleccionada);
            }
        }
        setErrores({}); 
    }, [categoriaAEditar, areaSeleccionada, grados]); 

    const toggleGrado = (gradoId) => {
        const gradoObj = grados.find(g => g.id === gradoId);
        if (!gradoObj) return;
        setGradosSeleccionados(prev => {
            const existe = prev.some(g => g.id === gradoId);
            if (existe) {
                return prev.filter(g => g.id !== gradoId);
            } else {
                if (prev.length === 1) {
                    const otro = prev[0];
                    const gradosOrdenados = grados.slice().sort((a, b) => a.id - b.id);
                    const idx1 = gradosOrdenados.findIndex(g => g.id === otro.id);
                    const idx2 = gradosOrdenados.findIndex(g => g.id === gradoObj.id);
                    const [start, end] = idx1 < idx2 ? [idx1, idx2] : [idx2, idx1];
                    const rango = gradosOrdenados.slice(start, end + 1).map(g => ({ id: g.id, nombre_grado: g.nombre_grado, nivel: g.nivel.nombre_nivel }));
                    console.log('Grados seleccionados:', rango.map(g => `${g.nombre_grado} (${g.nivel})`));
                    return rango;
                }
                const nuevos = [...prev, { id: gradoObj.id, nombre_grado: gradoObj.nombre_grado, nivel: gradoObj.nivel.nombre_nivel }];
                console.log('Grados seleccionados:', nuevos.map(g => `${g.nombre_grado} (${g.nivel})`));
                return nuevos;
            }
        });
    };

    const enviarFormulario = (e) => {
        e.preventDefault();

        const gradosPrimariaSeleccionados = gradosSeleccionados.filter(g => g.nivel.toLowerCase() === 'primaria').map(g => g.id);
        const gradosSecundariaSeleccionados = gradosSeleccionados.filter(g => g.nivel.toLowerCase() === 'secundaria').map(g => g.id);

        const resultadoValidacion = validarCampos({
            nombre,
            descripcion,
            areaSeleccionadaInterna,
            gradosPrimaria: gradosPrimariaSeleccionados,
            gradosSecundaria: gradosSecundariaSeleccionados,
            categoriasExistentes,
            relacionesCategoriasAreas: todasLasRelaciones,
            categoriaAEditar
        });

        if (!resultadoValidacion.esValido) {
            setErrores(resultadoValidacion.errores);
            return;
        }

        const idsSeleccionados = [...gradosPrimariaSeleccionados, ...gradosSecundariaSeleccionados];
        const idsExistentes = grados.map(g => g.id);
        const rango = [];
        if (idsSeleccionados.length) {
            const min = Math.min(...idsSeleccionados);
            const max = Math.max(...idsSeleccionados);
            for (let i = min; i <= max; i++) {
                if (!idsExistentes.includes(i)) {
                    mostrarToast('❌ El rango de grados seleccionado no es válido.');
                    return;
                }
                rango.push(i);
            }
        }

        const nuevaCategoria = {
            nombre,
            descripcion,
            area: areaSeleccionadaInterna,
            gradosPrimaria: gradosPrimariaSeleccionados,
            gradosSecundaria: gradosSecundariaSeleccionados,
        };

        console.log('Payload a enviar:', nuevaCategoria);

        if (categoriaAEditar) {
            onActualizarCategoria(nuevaCategoria);
        } else {
            onCrearCategoria(nuevaCategoria)
                .then(() => {
                    // Manejo de éxito
                    cerrar();
                    limpiarFormulario();
                })
                .catch((error) => {
                    const msg = error.response?.data?.error || '❌ Error al crear la categoría. Verifique los datos.';
                    mostrarToast(msg);
                    throw error;
                });
        }
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