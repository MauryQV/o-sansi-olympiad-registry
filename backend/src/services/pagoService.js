import prisma from '../config/prismaClient.js';


//helpers
export const obtenerIdCompetidor = async (userId) => {
    const competidor = await prisma.competidor.findUnique({
        where: {
            usuario_id: userId
        }
    });

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
        }
    });
}


export const verMisPagosPendientes = async (userId) => {
    return await prisma.pago.findMany({
        where: {
            estado: 'Pendiente',
            inscripcion: {
                competidor: {
                    usuario_id: userId
                }
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



export const validarPago = async (pagoId) => {
    const pago = await prisma.pago.findUnique({
        where: {
            id: pagoId
        }
    });

    if (!pago) {
        throw new Error('Pago no encontrado');
    }

    if (pago.estado !== 'Pendiente') {
        throw new Error('El pago ya esta validado o rechazado');
    }
    //falta agregar la logica
    return await prisma.pago.update({
        where: {
            id: pagoId
        },
        data: {
            estado: 'Validado'
        }
    });
}

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