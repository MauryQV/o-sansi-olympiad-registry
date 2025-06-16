import prisma from '../config/prismaClient.js';

/**
 * Obtiene el listado de postulantes con sus datos y estados de inscripción
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
export const obtenerPostulantes = async (req, res) => {
  try {
    //console.log("=== Solicitud de reportes ===");
    //console.log("Query params:", req.query);
    //console.log("User:", req.usuario);
    //console.log("URL completa:", req.url);
    //console.log("Parámetros recibidos:", JSON.stringify(req.query, null, 2));

    const { estado, area } = req.query;
    //console.log("Estado extraído:", estado);
    //  console.log("Área extraída:", area);

    // Construir el filtro dinámicamente basado en los parámetros de consulta
    let filtro = {};

    if (estado) {
      //console.log("APLICANDO FILTRO POR ESTADO:", estado);
      filtro.estado_inscripcion = estado;
    }

    if (area) {
      //  console.log("APLICANDO FILTRO POR ÁREA:", area);
      // Manejar variaciones de nombres de áreas
      const areasEquivalentes = [];

      // Agregar el área exacta
      areasEquivalentes.push(area);

      // Agregar variaciones conocidas
      const normalizarArea = (nombre) => nombre.toLowerCase().trim();
      const areaNormalizada = normalizarArea(area);

      if (areaNormalizada === 'biología') {
        areasEquivalentes.push('BIOLOGÍA', 'Biología', 'biología');
      } else if (areaNormalizada === 'química') {
        areasEquivalentes.push('QUÍMICA', 'Química', 'química');
      } else if (areaNormalizada === 'matemática' || areaNormalizada === 'matemáticas') {
        areasEquivalentes.push('Matemática', 'Matemáticas', 'matemática', 'matemáticas');
      }

      // Filtro que busca cualquiera de las variaciones
      filtro.area = {
        nombre_area: {
          in: areasEquivalentes
        }
      };
    }

    //console.log("===== FILTRO FINAL CONSTRUIDO =====");
    //console.log("Filtros aplicados:", JSON.stringify(filtro, null, 2));
    //console.log("¿Filtro vacío?", Object.keys(filtro).length === 0);

    // Verificar las áreas disponibles
    const areasDisponibles = await prisma.area.findMany();
    //console.log("Áreas disponibles:", areasDisponibles.map(a => `${a.id}:${a.nombre_area}`).join(', '));

    // Verificar estados únicos de inscripciones
    const estadosSinFiltro = await prisma.inscripcion.findMany({
      select: { estado_inscripcion: true },
      distinct: ['estado_inscripcion']
    });
    //console.log("Estados únicos en BD:", estadosSinFiltro.map(e => e.estado_inscripcion).join(', '));

    // Obtener inscripciones con datos básicos (simplificado para evitar problemas de relaciones)
    console.log("Ejecutando consulta con filtros:", JSON.stringify(filtro, null, 2));
    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        ...filtro,
        estado_inscripcion: { not: "Pendiente" }
      },
      include: {
        competidor: {
          include: {
            usuario: true,
            colegio: true
          }
        },
        area: true,
        categoria: true,
        convocatoria: true
      }
    });

    //console.log(`Encontradas ${inscripciones.length} inscripciones`);

    if (inscripciones.length > 0) {
      //console.log("Primera inscripción:", JSON.stringify({
      //  id: inscripciones[0].id,
      //  competidor_id: inscripciones[0].competidor_id,
      //  area_id: inscripciones[0].area_id,
      //  area_nombre: inscripciones[0].area?.nombre_area,
      //  estado: inscripciones[0].estado_inscripcion
      //}, null, 2));
    }

    // Formatear los datos para la respuesta
    const postulantes = inscripciones.map(inscripcion => {
      const competidor = inscripcion.competidor;

      return {
        id: inscripcion.id,
        estudiante: `${competidor?.usuario?.nombre || ''} ${competidor?.usuario?.apellido || ''}`.trim(),
        area: inscripcion.area?.nombre_area || 'No asignada',
        categoria: inscripcion.categoria?.nombre_categoria || 'No asignada',
        grado: competidor?.usuario?.nombre || 'No especificado', // Ajustar según disponibilidad
        fecha: inscripcion.fecha_inscripcion
          ? new Date(inscripcion.fecha_inscripcion).toLocaleDateString()
          : 'No registrada',
        estado: inscripcion.estado_inscripcion,
        email: competidor?.usuario?.correo_electronico || 'No registrado',
        telefono: competidor?.carnet_identidad || 'No registrado', // Ajustar según disponibilidad
        institucion: competidor?.colegio?.nombre_colegio || 'No registrada'
      };
    });

    //console.log(`Postulantes formateados: ${postulantes.length}`);

    res.status(200).json({ postulantes });
  } catch (error) {
    //console.error('Error al obtener postulantes:', error);
    res.status(500).json({ mensaje: 'Error al obtener datos de postulantes', error: error.message });
  }
}; 