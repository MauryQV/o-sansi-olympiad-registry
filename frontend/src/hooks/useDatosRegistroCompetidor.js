import { useEffect, useState } from 'react';

export const useDatosRegistroCompetidor = () => {
    const [inscripcionesActivas, setInscripcionesActivas] = useState(0);
    const [pagosPendientes, setPagosPendientes] = useState(0);
    const [convocatoriasDisponibles, setConvocatoriasDisponibles] = useState(0);
    const [inscripcionActiva, setInscripcionActiva] = useState(null);
    const [convocatoriaActiva, setConvocatoriaActiva] = useState(null);
    const [pagos, setPagos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Carga inmediata (sin setTimeout)
        const inscripcion = {
            area: 'Matemática',
            categoria: 'Quinto Nivel',
            grado: '5º',
            fecha: '01/03/2025',
            estado: 'Validada'
        };

        const convocatoria = {
            nombre: 'Olimpiada Científica Estudiantil 2025',
            descripcion: 'Convocatoria Anual para las olimpiadas científicas a nivel departamental',
            fechaInicio: '2025-03-01',
            fechaFin: '2025-04-07'
        };

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
        setConvocatoriasDisponibles(2);
        setInscripcionActiva(inscripcion);
        setConvocatoriaActiva(convocatoria);
        setPagos(pagosMock);
        setCargando(false);
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