import { useEffect, useState } from 'react';
import * as competidorDatos from '../services/competidorInscripcion'

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


                const inscripcion = {
                    area: 'Matemática',
                    categoria: 'Quinto Nivel',
                    grado: '5º',
                    fecha: '01/03/2025',
                    estado: 'Validada'
                };

                const convocatoria = await competidorDatos.obtenerUnaConvocatoriaActiva();
                setConvocatoriaActiva({
                    nombre: convocatoria.nombre_convocatoria,
                    descripcion: convocatoria.descripcion_convocatoria,
                    fechaInicio: new Date(convocatoria.fecha_inicio).toLocaleDateString(),
                    fechaFin: new Date(convocatoria.competicion_fin).toLocaleDateString(),
                });

                const pagosMock = [
                    {
                        boleta: 'BOL-2025-001',
                        area: 'Matemática',
                        monto: 'Bs. 15.00',
                        fecha: '01/04/2025',
                        estado: 'Pendiente'
                    }
                ];

                setInscripcionesActivas(1);
                setPagosPendientes(1);
                setInscripcionActiva(inscripcion);
                setConvocatoriaActiva(convocatoria);
                setPagos(pagosMock);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setConvocatoriasDisponibles(0); // Valor por defecto en caso de error
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
