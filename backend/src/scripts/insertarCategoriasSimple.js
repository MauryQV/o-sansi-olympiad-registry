import prisma from '../config/prismaClient.js';

async function insertarCategoriasSimple() {
  try {
    // Categorías a crear
    const categorias = [
      {
        nombre_categoria: "Nivel Básico - Matemáticas",
        descripcion_cat: "Nivel básico para estudiantes de matemáticas",
        grado_min_id: 1,
        grado_max_id: 2
      },
      {
        nombre_categoria: "Nivel Básico - Física",
        descripcion_cat: "Nivel básico para estudiantes de física",
        grado_min_id: 1,
        grado_max_id: 2
      },
      {
        nombre_categoria: "Nivel Básico - Química",
        descripcion_cat: "Nivel básico para estudiantes de química",
        grado_min_id: 1,
        grado_max_id: 2
      },
      {
        nombre_categoria: "Nivel Básico - Informática",
        descripcion_cat: "Nivel básico para estudiantes de informática",
        grado_min_id: 1,
        grado_max_id: 2
      },
      {
        nombre_categoria: "Nivel Básico - Astronomía",
        descripcion_cat: "Nivel básico para estudiantes de astronomía",
        grado_min_id: 1,
        grado_max_id: 2
      }
    ];

    for (const categoria of categorias) {
      // Verificar si ya existe
      const existente = await prisma.categoria.findFirst({
        where: { nombre_categoria: categoria.nombre_categoria }
      });
      
      if (existente) {
        console.log(`La categoría '${categoria.nombre_categoria}' ya existe con ID: ${existente.id}`);
        continue;
      }
      
      // Crear la categoría
      const nuevaCategoria = await prisma.categoria.create({
        data: categoria
      });
      
      console.log(`Categoría creada: '${nuevaCategoria.nombre_categoria}' (ID: ${nuevaCategoria.id})`);
    }

    console.log('Categorías insertadas correctamente');
  } catch (error) {
    console.error('Error al insertar categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertarCategoriasSimple(); 