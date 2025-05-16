import * as inscripcionService from '../services/InscripcionService.js';
import prisma from '../config/prismaClient.js';

export const registrarInscripcion = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;

    // buscar el competidor asociado al usuario autenticado
    const competidor = await prisma.competidor.findUnique({
      where: { usuario_id: usuarioId }
    });

    if (!competidor) {
      return res.status(404).json({ error: 'Competidor no encontrado para este usuario.' });
    }

    // datos de la inscripcion
    const { area_id, categoria_id, tutor_ids } = req.body;

    // Llamar al servicio para crear la inscripcion
    const resultado = await inscripcionService.crearInscripcion({
      competidor_id: competidor.id, // Obtenido del usuario autenticado
      categoria_id,
      area_id,
      tutor_ids
    });

    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al registrar inscripción:', error);
    res.status(500).json({ error: error.message || 'Error al inscribirse.' });
  }
};


export const aceptarInscripcionController = async (req, res) => {
  try {
    // obtener el usuario autenticado
    const usuarioId = req.usuario.id;

    // buscar el tutor asociado al usuario
    const tutor = await prisma.tutor.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!tutor) {
      return res.status(404).json({ error: 'No se encontró un tutor asociado a este usuario.' });
    }

    const inscripcion_id = parseInt(req.params.id, 10);

    // llamar al servicio con el tutor.id
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
    const usuarioId = req.usuario.id;

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


export const obtenerMotivosRechazoController = async (req, res) => {
  try {
    const motivos = await inscripcionService.obtenerMotivosRechazo();
    res.status(200).json(motivos);
  } catch (error) {
    console.error('Error al obtener motivos de rechazo:', error.message);
    res.status(400).json({ error: error.message });
  }
};