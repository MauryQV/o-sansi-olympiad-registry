import prisma from '../config/prismaClient.js';
import { validarToken } from '../utils/jwtUtils.js';

/**
 * Registra una nueva inscripción de competidor con sus tutores
 */
export const registrarInscripcion = async (req, res) => {
  try {
    const { convocatoria_id, area_id, grado, nivel, tutores } = req.body;
    
    if (!convocatoria_id || !area_id || !grado || !nivel || !tutores || !tutores.length) {
      return res.status(400).json({ error: 'Datos incompletos para la inscripción' });
    }
    
    // Obtener ID del usuario desde el token
    const token = req.headers.authorization;
    const decodedToken = validarToken(token);
    
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión' });
    }
    
    // Verificar que el usuario es un competidor
    const usuario = await prisma.usuario.findFirst({
      where: { id: decodedToken.id },
      include: { competidor: true }
    });
    
    if (!usuario || !usuario.competidor) {
      return res.status(403).json({ error: 'El usuario no está registrado como competidor' });
    }
    
    const competidor_id = usuario.competidor.id;
    
    // Verificar si la convocatoria está en periodo de inscripción
    const convocatoria = await prisma.convocatoria.findFirst({
      where: { id: parseInt(convocatoria_id) },
    });
    
    if (!convocatoria) {
      return res.status(404).json({ error: 'La convocatoria no existe' });
    }
    
    const fechaActual = new Date();
    if (fechaActual < convocatoria.fecha_inicio || fechaActual > convocatoria.fecha_fin) {
      return res.status(400).json({ error: 'El periodo de inscripción ha finalizado' });
    }
    
    // Verificar si el competidor ya está inscrito en esta área y convocatoria
    const inscripcionExistente = await prisma.inscripcion_area.findFirst({
      where: { 
        competidor_id,
        area_id: parseInt(area_id),
        convocatoria_id: parseInt(convocatoria_id)
      }
    });
    
    if (inscripcionExistente) {
      return res.status(400).json({ error: 'Ya se encuentra inscrito en esta área' });
    }
    
    // Verificar cantidad de áreas en las que está inscrito el competidor
    const cantidadInscripciones = await prisma.inscripcion_area.count({
      where: { 
        competidor_id,
        convocatoria_id: parseInt(convocatoria_id)
      }
    });
    
    if (cantidadInscripciones >= 2) {
      return res.status(400).json({ error: 'Ya se encuentra inscrito en 2 áreas (máximo permitido)' });
    }
    
    // Verificar que los tutores existen
    const tutorIds = tutores.map(id => typeof id === 'string' ? id : String(id));
    const tutoresEncontrados = await prisma.tutor.findMany({
      where: { id: { in: tutorIds } }
    });
    
    if (tutoresEncontrados.length !== tutorIds.length) {
      return res.status(400).json({ error: 'Uno o más tutores seleccionados no existen' });
    }
    
    // Crear la inscripción
    const nuevaInscripcion = await prisma.inscripcion.create({
      data: {
        fecha_inscripcion: new Date(),
        estado_inscripcion: 'pendiente'
      }
    });
    
    // Registrar en inscripcion_area
    await prisma.inscripcion_area.create({
      data: {
        competidor_id,
        area_id: parseInt(area_id),
        convocatoria_id: parseInt(convocatoria_id),
        fecha_inscripcion: new Date()
      }
    });
    
    // Relacionar competidor con tutores en la inscripción
    for (const tutorId of tutorIds) {
      await prisma.inscripcion_tutor.create({
        data: {
          inscripcion_id: nuevaInscripcion.id,
          tutor_id: tutorId,
          competidor_id,
          aprobado: false
        }
      });
    }
    
    return res.status(201).json({
      mensaje: 'Inscripción registrada con éxito',
      inscripcion: {
        id: nuevaInscripcion.id,
        fecha: nuevaInscripcion.fecha_inscripcion,
        estado: nuevaInscripcion.estado_inscripcion,
        tutores_count: tutores.length
      }
    });
    
  } catch (error) {
    console.error('Error en la inscripción:', error);
    return res.status(500).json({ error: 'Error en el servidor al procesar la inscripción' });
  }
};

/**
 * Obtiene la información académica para el formulario de inscripción
 */
export const obtenerInfoAcademica = async (req, res) => {
  try {
    const { convocatoriaId } = req.query;
    
    if (!convocatoriaId) {
      return res.status(400).json({ error: 'Se requiere el ID de la convocatoria' });
    }
    
    console.log("Obteniendo información académica para convocatoria:", convocatoriaId);
    
    // Obtener áreas disponibles para la convocatoria
    const areasConvocatoria = await prisma.area_convocatoria.findMany({
      where: { convocatoria_id: parseInt(convocatoriaId) },
      include: {
        area: true
      }
    });
    
    // Obtener las categorías asociadas con las áreas
    const areasIds = areasConvocatoria.map(ac => ac.area_id);
    
    const categoriasPorArea = await prisma.categoria_area.findMany({
      where: { area_id: { in: areasIds } },
      include: {
        categoria: true,
        area: true
      }
    });
    
    // Obtener grados y niveles
    const grados = await prisma.grado.findMany();
    const niveles = await prisma.nivel.findMany();
    
    // Formatear áreas y categorías
    const areas = areasConvocatoria.map(ac => {
      // Filtrar categorías por esta área específica
      const categoriasDeArea = categoriasPorArea
        .filter(ca => ca.area_id === ac.area_id)
        .map(ca => ({
          id: ca.categoria.id,
          nombre_categoria: ca.categoria.nombre_categoria,
          descripcion_cat: ca.categoria.descripcion_cat
        }));
      
      return {
        id: ac.area.id,
        nombre_area: ac.area.nombre_area,
        descripcion_area: ac.area.descripcion_area,
        costo: ac.area.costo,
        categorias: categoriasDeArea
      };
    });
    
    console.log(`Encontradas ${areas.length} áreas, ${grados.length} grados y ${niveles.length} niveles`);
    console.log("Áreas:", JSON.stringify(areas));
    
    return res.status(200).json({
      areas,
      grados,
      niveles
    });
    
  } catch (error) {
    console.error('Error al obtener información académica:', error);
    return res.status(500).json({ error: 'Error en el servidor al obtener información académica' });
  }
};

/**
 * Verifica si el periodo de inscripción está activo
 */
export const verificarPeriodoInscripcion = async (req, res) => {
  try {
    const { convocatoriaId } = req.query;
    
    if (!convocatoriaId) {
      return res.status(400).json({ error: 'Se requiere el ID de la convocatoria' });
    }
    
    const convocatoria = await prisma.convocatoria.findFirst({
      where: { id: parseInt(convocatoriaId) }
    });
    
    if (!convocatoria) {
      return res.status(404).json({ error: 'La convocatoria no existe' });
    }
    
    const fechaActual = new Date();
    const periodoActivo = fechaActual >= convocatoria.fecha_inicio && fechaActual <= convocatoria.fecha_fin;
    
    return res.status(200).json({
      activo: periodoActivo,
      fecha_inicio: convocatoria.fecha_inicio,
      fecha_fin: convocatoria.fecha_fin
    });
    
  } catch (error) {
    console.error('Error al verificar periodo de inscripción:', error);
    return res.status(500).json({ error: 'Error en el servidor al verificar periodo de inscripción' });
  }
}; 