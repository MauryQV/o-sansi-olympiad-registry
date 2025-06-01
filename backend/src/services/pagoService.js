import prisma from '../config/prismaClient.js';
import { crearNotificacion } from './notificacionService.js';

//helpers
export const obtenerIdCompetidor = async (userId) => {
    const competidor = await prisma.competidor.findUnique({
        where: {
            usuario_id: userId
        }
    });
    //console.log('ID del competidor pago service:', competidor ? competidor.id : 'No se encontró competidor para el usuario');
    if (!competidor) {
        throw new Error('Competidor no encontrado');
    }

    return competidor.id;
}
//se esta usando triggers para generar un registro en la tabla de pagos
//deberia retornar algo como BOL-2025-001---N


export const obtenerPagosPendientes = async () => {
    return await prisma.pago.findMany({
        where: {
            estado: 'Pendiente'
        },
        select: {
            id: true,
            codigo_pago: true,
            monto: true,
            estado: true,
            fecha_pago: true,
            inscripcion: {
                select: {
                    area: {
                        select: { nombre_area: true }
                    },
                    competidor: {
                        select: {
                            carnet_identidad: true,
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            fecha_pago: 'desc'
        }
    });
}


export const verMisPagosPendientes = async (userId) => {
    console.log('ID del usuario en verMisPagosPendientes:', userId);
    return await prisma.pago.findMany({
        where: {
            estado: 'Pendiente',
            inscripcion: {
                competidor_id: userId
            }
        },
        select: {
            id: true,
            codigo_pago: true,
            monto: true,
            estado: true,
            fecha_pago: true,
            inscripcion: {
                select: {
                    area: {
                        select: {
                            nombre_area: true
                        }
                    },
                    competidor: {
                        select: {
                            carnet_identidad: true, // este es el CI correcto
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true,
                                    correo_electronico: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

export const verDetallePago = async (pagoId) => {
    const pago = await prisma.pago.findUnique({
        where: {
            id: pagoId
        },
        select: {
            id: true,
            codigo_pago: true,
            monto: true,
            estado: true,
            fecha_pago: true,
            inscripcion: {
                select: {
                    area: {
                        select: {
                            nombre_area: true
                        }
                    },
                    competidor: {
                        select: {
                            carnet_identidad: true, // este es el CI correcto
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true,
                                    correo_electronico: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!pago) {
        throw new Error('Pago no encontrado');
    }

    return {
        codigo: pago.codigo_pago,
        monto: pago.monto,
        estado: pago.estado,
        fecha_emision: pago.fecha_pago,
        area: pago.inscripcion.area.nombre_area,
        competidor: {
            nombre_completo: `${pago.inscripcion.competidor.usuario.nombre} ${pago.inscripcion.competidor.usuario.apellido}`,
            ci: pago.inscripcion.competidor.carnet_identidad,
            email: pago.inscripcion.competidor.usuario.correo_electronico
        }
    };
};



export const validarPago = async (pagoId, io, connectedUsers) => {
    try {
        const pago = await prisma.pago.findUnique({
            where: {
                id: pagoId
            },
            include: {
                inscripcion: {
                    include: {
                        competidor: {
                            include: { usuario: true }
                        }
                    }
                }
            }
        });

        if (!pago) {
            throw new Error('Pago no encontrado');
        }

        if (pago.estado !== 'Pendiente') {
            throw new Error('El pago ya está pagado o rechazado');
        }

        const updatedPago = await prisma.pago.update({
            where: { id: pagoId },
            data: {
                estado: 'Pagado',
                fecha_pago: new Date()
            }
        });

        // Obtener usuario del competidor
        const usuario = pago.inscripcion.competidor.usuario;

        // Crear notificación
        const noti = await crearNotificacion({
            usuarioId: usuario.id,
            tipo: 'estado',
            mensaje: 'Tu pago ha sido validado y marcado como pagado.'
        });

        // Enviar notificación vía socket
        const socketId = connectedUsers.get(usuario.id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', noti);
        }

        return {
            success: true,
            mensaje: 'Pago validado y marcado como pagado.',
            pago: updatedPago
        };
    } catch (error) {
        console.error('Error al validar pago:', error);
        throw error;
    }
};


export const buscarPagos = async ({ tipo, valor }) => {
    if (!valor || valor.trim() === '') {
        throw new Error('Debe proporcionar un valor de búsqueda.');
    }

    const where = {
        estado: 'Pendiente'
    };

    if (tipo === 'ci') {
        where.inscripcion = {
            competidor: {
                carnet_identidad: {
                    contains: valor
                }
            }
        };
    }

    if (tipo === 'nombre') {
        where.inscripcion = {
            competidor: {
                usuario: {
                    OR: [
                        { nombre: { contains: valor, mode: 'insensitive' } },
                        { apellido: { contains: valor, mode: 'insensitive' } }
                    ]
                }
            }
        };
    }

    if (tipo === 'codigo') {
        where.codigo_pago = {
            contains: valor,
            mode: 'insensitive'
        };
    }

    return await prisma.pago.findMany({
        where,
        select: {
            codigo_pago: true,
            monto: true,
            fecha_pago: true,
            inscripcion: {
                select: {
                    competidor: {
                        select: {
                            carnet_identidad: true, // Incluir el carnet de identidad del competidor
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            fecha_pago: 'desc'
        }
    });
};

//en espera
export const emitirBoleta = async (pagoId) => {
    const pago = await prisma.pago.findUnique({
        where: {
            id: pagoId
        }
    });

    if (!pago) {
        throw new Error('Pago no encontrado');
    }

    if (pago.estado !== 'Validado') {
        throw new Error('El pago no esta validado');
    }

    return await prisma.pago.update({
        where: {
            id: pagoId
        },
        data: {
            estado: 'Emitido'
        }
    });
}


//Jhazmin
export const obtenerPagosRealizados = async () => {
    return await prisma.pago.findMany({
        where: {
            estado: 'Pagado'
        },
        select: {
            id: true,
            codigo_pago: true,
            monto: true,
            estado: true,
            fecha_pago: true,
            inscripcion: {
                select: {
                    area: {
                        select: {
                            nombre_area: true
                        }
                    },
                    competidor: {
                        select: {
                            carnet_identidad: true,
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            fecha_pago: 'desc'
        }
    });
};

export const obtenerEstadisticasPagos = async () => {
    const totalPagos = await prisma.pago.count();
    const pagosPendientes = await prisma.pago.count({
        where: { estado: 'Pendiente' }
    });
    const pagosValidados = await prisma.pago.count({
        where: { estado: 'Pagado' }
    });
    const montoTotal = await prisma.pago.aggregate({
        where: { estado: 'Pagado' },
        _sum: { monto: true }
    });

    return {
        totalPagos,
        pagosPendientes,
        pagosValidados,
        montoTotal: montoTotal._sum.monto || 0
    };
};

export const obtenerPagosCompetidorService = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // Get the competitor ID first
    const competidor = await prisma.competidor.findUnique({
        where: {
            usuario_id: userId
        }
    });

    if (!competidor) {
        throw new Error('Competidor no encontrado');
    }

    // Get total count of payments
    const total = await prisma.pago.count({
        where: {
            inscripcion: {
                competidor_id: competidor.id
            }
        }
    });

    // Get paginated payments
    const pagos = await prisma.pago.findMany({
        where: {
            inscripcion: {
                competidor_id: competidor.id
            }
        },
        select: {
            id: true,
            codigo_pago: true,
            monto: true,
            estado: true,
            fecha_pago: true,
            inscripcion: {
                select: {
                    area: {
                        select: { nombre_area: true }
                    },
                    competidor: {
                        select: {
                            carnet_identidad: true,
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            fecha_pago: 'desc'
        },
        skip,
        take: limit
    });

    return {
        pagos: pagos.map(pago => ({
            id: pago.id,
            boleta: pago.codigo_pago,
            monto: `Bs. ${pago.monto}`,
            fecha: new Date(pago.fecha_pago).toLocaleDateString(),
            estado: pago.estado,
            area: pago.inscripcion.area.nombre_area,
            nombre: `${pago.inscripcion.competidor.usuario.nombre} ${pago.inscripcion.competidor.usuario.apellido}`,
            ci: pago.inscripcion.competidor.carnet_identidad
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};