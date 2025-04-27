import prisma from '../config/prismaClient.js';

async function insertarEstados() {
  try {
    const estados = [
      { nombre: 'En inscripción' },
      { nombre: 'En competencia' },
      { nombre: 'Finalizada' }
    ];

    for (const estado of estados) {
      const existente = await prisma.estado_convocatoria.findFirst({
        where: { nombre: estado.nombre }
      });
      
      if (!existente) {
        const nuevoEstado = await prisma.estado_convocatoria.create({
          data: estado
        });
        console.log(`Estado creado: ${nuevoEstado.nombre} (ID: ${nuevoEstado.id})`);
      } else {
        console.log(`El estado "${estado.nombre}" ya existe con ID: ${existente.id}`);
      }
    }

    console.log('Estados insertados correctamente');
  } catch (error) {
    console.error('Error al insertar estados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertarEstados(); 