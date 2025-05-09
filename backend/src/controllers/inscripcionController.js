import * as inscripcionService from '../services/InscripcionService.js';
import prisma from '../config/prismaClient.js';

export const registrarInscripcion = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;

    const competidor = await prisma.competidor.findUnique({
      where: { usuario_id: usuarioId }
    });

    if (!competidor) {
      return res.status(404).json({ error: 'Competidor no encontrado para este usuario.' });
    }

    const { convocatoriaId, areaId, tutorIds } = req.body;

    const resultado = await inscripcionService.crearInscripcion({
      competidorId: competidor.id,
      convocatoriaId,
      areaId,
      tutorIds
    });

    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al registrar inscripción:', error);
    res.status(500).json({ error: error.message || 'Error al inscribirse.' });
  }
};


export const aceptarInscripcionController = async (req, res) => {
  try {
    // Obtener el usuario autenticado
    const usuarioId = req.user.id;

    // Buscar el tutor asociado al usuario
    const tutor = await prisma.tutor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!tutor) {
      return res.status(404).json({ error: 'No se encontró un tutor asociado a este usuario.' });
    }

    const inscripcion_id = parseInt(req.params.id, 10);

    // Llamar al servicio con el tutor.id
    const resultado = await inscripcionService.aceptarInscripcion({ inscripcion_id, tutorId: tutor.id });
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al aceptar inscripción:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const rechazarInscripcionController = async (req, res) => {
  try {
    // Obtener el usuario autenticado
    const usuarioId = req.user.id;

    // Buscar el tutor asociado al usuario
    const tutor = await prisma.tutor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!tutor) {
      return res.status(404).json({ error: 'No se encontró un tutor asociado a este usuario.' });
    }

    const inscripcion_id = parseInt(req.params.id, 10);
    const { motivo_rechazo_id } = req.body;

    // Llamar al servicio con el tutor.id
    const resultado = await inscripcionService.rechazarInscripcion({ inscripcion_id, tutorId: tutor.id, motivo_rechazo_id });
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al rechazar inscripción:', error.message);
    res.status(400).json({ error: error.message });
  }
};