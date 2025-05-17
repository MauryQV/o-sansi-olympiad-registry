import { useState } from 'react';
import Swal from 'sweetalert2';
import { eliminarConvocatoria } from '../services/convocatoriaService';

export const useEliminarConvocatoria = () => {
    const [cargando, setCargando] = useState(false);

    const ejecutarEliminacion = async (id) => {
        try {
            setCargando(true);

            // Llamar al servicio de eliminación
            await eliminarConvocatoria(id);

            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: 'Convocatoria eliminada',
                text: 'La convocatoria ha sido eliminada correctamente.'
            });

            return true; // Retornar true si la eliminación fue exitosa
        } catch (error) {
            console.error('Error al eliminar la convocatoria:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la convocatoria. Por favor, intente nuevamente.'
            });
            return false; // Retornar false si hubo un error
        } finally {
            setCargando(false);
        }
    };

    return {
        cargando,
        ejecutarEliminacion
    };
};