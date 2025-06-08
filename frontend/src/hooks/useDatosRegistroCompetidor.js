import { useEffect, useState } from 'react';
import * as competidorDatos from '../services/competidorInscripcion'
import { verMisPagosPendientes } from '../services/pagoService';
import { obtenerMisInscripciones } from '../services/competidorInscripcion';

export const useDatosRegistroCompetidor = () => {
    const [inscripcionesActivas, setInscripcionesActivas] = useState(0);
    const [pagosPendientes, setPagosPendientes] = useState(0);
    const [convocatoriasDisponibles, setConvocatoriasDisponibles] = useState(0);
    const [inscripcionActiva, setInscripcionActiva] = useState(null);
    const [convocatoriaActiva, setConvocatoriaActiva] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                const convocatoriasActivas = await competidorDatos.obtenerNumerodeConvocatoriasActivas();
                setConvocatoriasDisponibles(convocatoriasActivas.convocatorias_activas);

                // Obtener pagos reales
                const pagosReales = await verMisPagosPendientes();
                // Transformar pagos al formato esperado por la tabla
                const pagosTransformados = pagosReales.map(pago => ({
                    id: pago.id,
                    boleta: pago.codigo_pago,
                    area: pago.inscripcion?.area?.nombre_area || 'N/A',
                    monto: `Bs. ${pago.monto}`,
                    fecha: new Date(pago.fecha_pago).toLocaleDateString('es-ES'),
                    estado: pago.estado
                }));
                setPagos(pagosTransformados);
                setPagosPendientes(pagosTransformados.filter(p => p.estado === 'Pendiente').length);

                // Obtener inscripciones reales
                const inscripciones = await obtenerMisInscripciones();
                let inscripcionActivaReal = null;
                if (inscripciones && inscripciones.length > 0) {
                    // Tomar la inscripción más reciente (ya viene ordenada por fecha desc)
                    const insc = inscripciones[0];
                    inscripcionActivaReal = {
                        area: insc.area,
                        categoria: insc.categoria,
                        grado: insc.grado,
                        fecha: new Date(insc.fecha_inscripcion).toLocaleDateString('es-ES'),
                        estado: insc.estado
                    };
                    setInscripcionesActivas(inscripciones.length);
                } else {
                    setInscripcionesActivas(0);
                }
                setInscripcionActiva(inscripcionActivaReal);

                const convocatoria = await competidorDatos.obtenerUnaConvocatoriaActiva();
                let estadoConvocatoria = 'Desconocido';
                if (convocatoria && convocatoria.fecha_inicio && convocatoria.competicion_fin) {
                    const ahora = new Date();
                    const inicio = new Date(convocatoria.fecha_inicio);
                    const fin = new Date(convocatoria.competicion_fin);
                    if (ahora < inicio) {
                        estadoConvocatoria = 'Próxima';
                    } else if (ahora >= inicio && ahora <= fin) {
                        estadoConvocatoria = 'En Inscripción';
                    } else if (ahora > fin) {
                        estadoConvocatoria = 'Finalizada';
                    }
                }
                setConvocatoriaActiva({
                    nombre: convocatoria.nombre_convocatoria,
                    descripcion: convocatoria.descripcion_convocatoria,
                    fechaInicio: new Date(convocatoria.fecha_inicio).toLocaleDateString(),
                    fechaFin: new Date(convocatoria.competicion_fin).toLocaleDateString(),
                    estado: estadoConvocatoria
                });
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setConvocatoriasDisponibles(0); // Valor por defecto en caso de error
                setPagos([]);
                setPagosPendientes(0);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    return {
        inscripcionesActivas,
        pagosPendientes,
        convocatoriasDisponibles,
        inscripcionActiva,
        convocatoriaActiva,
        pagos,
        cargando
    };
};
