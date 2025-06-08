import prisma from "../config/prismaClient.js";

export const requirePermiso = (nombrePermiso) => {
    return async (req, res, next) => {
        if (!req.usuario || !req.usuario.rol_id) {
            return res.status(401).json({ error: 'Token no válido o rol ausente' });
        }

        try {
            const permisos = await prisma.rol_permiso.findMany({
                where: {
                    rol_id: req.usuario.rol_id,
                    permiso: {
                        nombre: nombrePermiso
                    }
                },
                include: {
                    permiso: true
                }
            });

            if (permisos.length === 0) {
                return res.status(403).json({ error: 'Permiso denegado' });
            }

            next();
        } catch (err) {
            console.error('Error al verificar permiso:', err);
            res.status(500).json({ error: 'Error interno al verificar permisos' });
        }
    };
};

/**
 * Middleware para verificar si el usuario tiene uno de los roles especificados
 * @param {Array} rolesPermitidos - Array de nombres de roles permitidos
 * @returns {Function} Middleware de Express
 */
export const verificarRol = (rolesPermitidos) => {
    return async (req, res, next) => {
        // console.log('Verificando roles para:', req.usuario);
        //console.log('Roles permitidos:', rolesPermitidos);

        if (!req.usuario || !req.usuario.rol_id) {
            //console.log('Token no válido o rol ausente');
            return res.status(401).json({ error: 'Token no válido o rol ausente' });
        }

        try {
            // Obtener el rol del usuario
            const rol = await prisma.rol.findUnique({
                where: {
                    id: req.usuario.rol_id
                }
            });

            if (!rol) {
                console.log('Rol no encontrado para el usuario:', req.usuario.id);
                return res.status(403).json({ error: 'Rol no encontrado' });
            }

            console.log('Rol del usuario:', rol);

            // Verificar si el rol del usuario está en la lista de roles permitidos
            const rolNombre = rol.nombre.toLowerCase();
            const tienePermiso = rolesPermitidos.some(r => r.toLowerCase() === rolNombre);

            console.log(`¿El usuario tiene el rol permitido? ${tienePermiso}`);

            if (!tienePermiso) {
                return res.status(403).json({ error: 'Acceso denegado para este rol' });
            }

            next();
        } catch (err) {
            console.error('Error al verificar rol:', err);
            res.status(500).json({ error: 'Error interno al verificar rol' });
        }
    };
};

export const esCajero = (req, res, next) => {

    if (!req.usuario || !req.usuario.rol_id) {
        return res.status(401).json({ error: 'token invalido' });
    }

    // console.log('Rol del usuario:', req.usuario.rol_id); // Debugging
    if (req.usuario.rol_id !== 3) { // id 2 rol de cajero
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
}

export const esTutor = (req, res, next) => {
    if (!req.usuario || !req.usuario.rol_id) {
        return res.status(401).json({ error: 'token invalido' });
    }

    if (req.usuario.rol_id !== 4) { // id 4 rol de tutor
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
}