import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { obtenerConvocatoriaPorId, actualizarConvocatoria } from '../services/convocatoriaService';
import { getAreas } from '../services/areaService';
import { getEstadosConvocatoria } from '../services/estadoService';
import { validarFormulario } from '../forms/validacionFormularioEditarConvocatoria';


export const useEditarConvocatoria = ({ visible, convocatoriaId, recargarConvocatorias, cerrar }) => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        id_estado_convocatoria: '',
        descripcion: '',
        inscripcionInicio: '',
        inscripcionFin: '',
        pagoInicio: '',
        pagoFin: '',
        competenciaInicio: '',
        competenciaFin: '',
        areasSeleccionadas: []
    });

    const [areasDisponibles, setAreasDisponibles] = useState([]);
    const [estadosDisponibles, setEstadosDisponibles] = useState([]);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (visible && convocatoriaId) {
            cargarDatos();
        }
    }, [visible, convocatoriaId]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [areas, estados] = await Promise.all([getAreas(), getEstadosConvocatoria()]);
            setAreasDisponibles(areas);
            setEstadosDisponibles(estados);

            if (convocatoriaId) {
                console.log('Modulo de Hook, ID de convocatoria:', convocatoriaId);
                const convocatoria = await obtenerConvocatoriaPorId(convocatoriaId);
                console.log('Modulo de Hook, Convocatoria recibida:', convocatoria);

                // Extraer correctamente los IDs de área
                const areasIds = convocatoria.Area_convocatoria
                    ? convocatoria.Area_convocatoria.map(ac => ac.area_id)
                    : [];

                console.log('Áreas detectadas:', areasIds); // Log para depuración

                setFormulario({
                    nombre: convocatoria.nombre_convocatoria || '',
                    id_estado_convocatoria: convocatoria.id_estado_convocatoria?.toString() || '',
                    descripcion: convocatoria.descripcion_convocatoria || '',
                    inscripcionInicio: formatDate(convocatoria.fecha_inicio),
                    inscripcionFin: formatDate(convocatoria.fecha_fin),
                    pagoInicio: formatDate(convocatoria.pago_inicio),
                    pagoFin: formatDate(convocatoria.pago_fin),
                    competenciaInicio: formatDate(convocatoria.competicion_inicio),
                    competenciaFin: formatDate(convocatoria.competicion_fin),
                    areasSeleccionadas: areasIds
                });

                console.log('Formulario actualizado:', {
                    nombre: convocatoria.nombre_convocatoria || '',
                    id_estado_convocatoria: convocatoria.id_estado_convocatoria?.toString() || '',
                    descripcion: convocatoria.descripcion_convocatoria || '',
                    inscripcionInicio: formatDate(convocatoria.fecha_inicio),
                    inscripcionFin: formatDate(convocatoria.fecha_fin),
                    pagoInicio: formatDate(convocatoria.pago_inicio),
                    pagoFin: formatDate(convocatoria.pago_fin),
                    competenciaInicio: formatDate(convocatoria.competicion_inicio),
                    competenciaFin: formatDate(convocatoria.competicion_fin),
                    areasSeleccionadas: areasIds
                });
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        } finally {
            setCargando(false);
        }
    };

    const validarFechasEnTiempoReal = (form) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const err = {};

        const parse = (f) => f ? new Date(f) : null;

        const fi = parse(form.inscripcionInicio);
        const ff = parse(form.inscripcionFin);
        const pi = parse(form.pagoInicio);
        const pf = parse(form.pagoFin);
        const ci = parse(form.competenciaInicio);
        const cf = parse(form.competenciaFin);

        if (fi && fi < hoy) err.inscripcionInicio = 'Debe ser igual o posterior a hoy.';
        if (fi && ff && ff <= fi) err.inscripcionFin = 'Debe ser después de la fecha de inicio.';
        if (ff && pi && pi <= ff) err.pagoInicio = 'El inicio de pago debe ser después de inscripción.';
        if (pi && pf && pf <= pi) err.pagoFin = 'Debe ser posterior al inicio de pago.';
        if (pf && ci && ci <= pf) err.competenciaInicio = 'Inicio de competencia debe ser después de pago.';
        if (ci && cf && cf <= ci) err.competenciaFin = 'Debe ser después del inicio de competencia.';

        return err;
    };


    const manejarCambio = (e) => {
        const { name, value } = e.target;
        const actualizado = { ...formulario, [name]: value };
        setFormulario(actualizado);

        const nuevosErrores = { ...errores, [name]: '' };

        if (name === 'nombre' && value.length > 100) {
            nuevosErrores.nombre = 'Máximo 100 caracteres.';
        }
        if (name === 'descripcion' && value.length > 1000) {
            nuevosErrores.descripcion = 'Máximo 1000 caracteres.';
        }

        const erroresFechas = validarFechasEnTiempoReal(actualizado);
        setErrores({ ...nuevosErrores, ...erroresFechas });
    };


    const manejarCheckbox = (idArea) => {
        const seleccionadas = formulario.areasSeleccionadas.includes(idArea)
            ? formulario.areasSeleccionadas.filter(a => a !== idArea)
            : [...formulario.areasSeleccionadas, idArea];

        setFormulario(prev => ({ ...prev, areasSeleccionadas: seleccionadas }));
        setErrores(prev => ({ ...prev, areasSeleccionadas: '' }));
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();

        const nuevosErrores = validarFormulario(formulario);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        try {
            const data = {
                nombre_convocatoria: formulario.nombre,
                id_estado_convocatoria: parseInt(formulario.id_estado_convocatoria),
                fecha_inicio: new Date(formulario.inscripcionInicio).toISOString(),
                fecha_fin: new Date(formulario.inscripcionFin).toISOString(),
                pago_inicio: new Date(formulario.pagoInicio).toISOString(),
                pago_fin: new Date(formulario.pagoFin).toISOString(),
                competicion_inicio: new Date(formulario.competenciaInicio).toISOString(),
                competicion_fin: new Date(formulario.competenciaFin).toISOString(),
                descripcion_convocatoria: formulario.descripcion,
                areaIds: formulario.areasSeleccionadas
            };

            await actualizarConvocatoria(convocatoriaId, data);
            Swal.fire('Éxito', 'Convocatoria actualizada correctamente', 'success');
            recargarConvocatorias?.();
            cerrar();
        } catch (error) {
            console.error('Error actualizando convocatoria:', error);
            Swal.fire('Error', 'No se pudo actualizar la convocatoria', 'error');
        }
    };

    const formatDate = (fecha) => {
        if (!fecha) return '';
        try {
            return new Date(fecha).toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formateando fecha:', error, fecha);
            return '';
        }
    };

    return {
        formulario,
        errores,
        cargando,
        areasDisponibles,
        estadosDisponibles,
        manejarCambio,
        manejarCheckbox,
        manejarSubmit
    };
};