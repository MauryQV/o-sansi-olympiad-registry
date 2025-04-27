import prisma from '../config/prismaClient.js';

async function insertarConvocatorias() {
  try {
    // Convocatorias a crear
    const convocatorias = [
      {
        nombre_convocatoria: "Olimpiadas Científicas 2025",
        descripcion_convocatoria: "Convocatoria anual para las olimpiadas científicas 2025",
        id_estado_convocatoria: 1, // En inscripción
        fecha_inicio: new Date("2025-01-15"),
        fecha_fin: new Date("2025-02-15"),
        competicion_inicio: new Date("2025-03-01"),
        competicion_fin: new Date("2025-03-15"),
        areas: [4, 5, 6] // IDs de áreas: Matemáticas, Física, Química
      },
      {
        nombre_convocatoria: "Olimpiadas de Informática 2025",
        descripcion_convocatoria: "Convocatoria específica para el área de informática",
        id_estado_convocatoria: 1, // En inscripción
        fecha_inicio: new Date("2025-02-01"),
        fecha_fin: new Date("2025-03-01"),
        competicion_inicio: new Date("2025-03-15"),
        competicion_fin: new Date("2025-03-30"),
        areas: [7] // ID de área: Informática
      },
      {
        nombre_convocatoria: "Olimpiadas de Astronomía 2025",
        descripcion_convocatoria: "Convocatoria específica para el área de astronomía",
        id_estado_convocatoria: 1, // En inscripción
        fecha_inicio: new Date("2025-03-01"),
        fecha_fin: new Date("2025-04-01"),
        competicion_inicio: new Date("2025-04-15"),
        competicion_fin: new Date("2025-04-30"),
        areas: [8] // ID de área: Astronomía
      },
      {
        nombre_convocatoria: "Competencia de Matemáticas 2025",
        descripcion_convocatoria: "Competencia exclusiva para el área de matemáticas",
        id_estado_convocatoria: 2, // En competencia
        fecha_inicio: new Date("2025-01-01"),
        fecha_fin: new Date("2025-01-31"),
        competicion_inicio: new Date("2025-02-15"),
        competicion_fin: new Date("2025-02-28"),
        areas: [4] // ID de área: Matemáticas
      },
      {
        nombre_convocatoria: "Olimpiadas Científicas Multidisciplinarias 2025",
        descripcion_convocatoria: "Gran convocatoria que abarca todas las áreas científicas",
        id_estado_convocatoria: 3, // Finalizada
        fecha_inicio: new Date("2024-12-01"),
        fecha_fin: new Date("2024-12-31"),
        competicion_inicio: new Date("2025-01-15"),
        competicion_fin: new Date("2025-01-30"),
        areas: [4, 5, 6, 7, 8] // Todas las áreas
      }
    ];

    for (const convocatoria of convocatorias) {
      // Extraemos las áreas y luego las quitamos del objeto a insertar
      const { areas, ...convocatoriaData } = convocatoria;
      
      // Verificar si ya existe
      const existente = await prisma.convocatoria.findFirst({
        where: { nombre_convocatoria: convocatoriaData.nombre_convocatoria }
      });
      
      if (existente) {
        console.log(`La convocatoria '${convocatoriaData.nombre_convocatoria}' ya existe con ID: ${existente.id}`);
        continue;
      }
      
      // Crear la convocatoria
      const nuevaConvocatoria = await prisma.convocatoria.create({
        data: convocatoriaData
      });
      
      // Crear las relaciones con áreas
      for (const areaId of areas) {
        await prisma.area_convocatoria.create({
          data: {
            convocatoria_id: nuevaConvocatoria.id,
            area_id: areaId
          }
        });
      }
      
      console.log(`Convocatoria creada: '${nuevaConvocatoria.nombre_convocatoria}' (ID: ${nuevaConvocatoria.id}) con ${areas.length} áreas asociadas`);
    }

    console.log('Convocatorias insertadas correctamente');
  } catch (error) {
    console.error('Error al insertar convocatorias:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertarConvocatorias(); 