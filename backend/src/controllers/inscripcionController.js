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


export const validarInscripcion = async (req, res, next) => {
  try {
    const tutorUsuarioId = req.user.id;

    const tutor = await prisma.tutor.findUnique({
      where: { usuario_id: tutorUsuarioId }
    });

    if (!tutor) {
      return res.status(403).json({ error: 'Solo tutores pueden realizar esta acción.' });
    }

    const { inscripcionId, acepta } = req.body;

    const resultado = await inscripcionService.validarInscripcion({
      tutorId: tutor.id,
      inscripcionId,
      acepta
    });

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al validar inscripción:', error);
    res.status(500).json({ error: error.message });
  }
};


