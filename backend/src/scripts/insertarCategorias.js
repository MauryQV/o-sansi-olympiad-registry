import prisma from '../config/prismaClient.js';

async function insertarCategorias() {
  try {
    // Primero verificamos que existan los grados necesarios
    const grado1 = await prisma.grado.findUnique({ where: { id: 1 } });
    const grado2 = await prisma.grado.findUnique({ where: { id: 2 } });

    if (!grado1 || !grado2) {
      console.log('Creando grados necesarios...');
      if (!grado1) {
        await prisma.grado.create({
          data: { id: 1, nombre_grado: '3° Primaria' }
        });
      }
      if (!grado2) {
        await prisma.grado.create({
          data: { id: 2, nombre_grado: '6° Primaria' }
        });
      }
    }
    
    // Categorías a crear
    const categorias = [
      {
        nombre_categoria: "Nivel Básico - Matemáticas",
        descripcion_cat: "Nivel básico para estudiantes de matemáticas",
        grado_min_id: 1,
        grado_max_id: 2,
        area_id: 4 // Matemáticas
      },
      {
        nombre_categoria: "Nivel Básico - Física",
        descripcion_cat: "Nivel básico para estudiantes de física",
        grado_min_id: 1,
        grado_max_id: 2,
        area_id: 5 // Física
      },
      {
        nombre_categoria: "Nivel Básico - Química",
        descripcion_cat: "Nivel básico para estudiantes de química",
        grado_min_id: 1,
        grado_max_id: 2,
        area_id: 6 // Química
      },
      {
        nombre_categoria: "Nivel Básico - Informática",
        descripcion_cat: "Nivel básico para estudiantes de informática",
        grado_min_id: 1,
        grado_max_id: 2,
        area_id: 7 // Informática
      },
      {
        nombre_categoria: "Nivel Básico - Astronomía",
        descripcion_cat: "Nivel básico para estudiantes de astronomía",
        grado_min_id: 1,
        grado_max_id: 2,
        area_id: 8 // Astronomía
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
      
      // Extraemos el area_id y luego lo quitamos del objeto a insertar
      const { area_id, ...categoriaData } = categoria;
      
      // Crear la categoría
      const nuevaCategoria = await prisma.categoria.create({
        data: categoriaData
      });
      
      // Crear la relación entre categoría y área
      await prisma.categoria_area.create({
        data: {
          categoria_id: nuevaCategoria.id,
          area_id: area_id
        }
      });
      
      console.log(`Categoría creada: '${nuevaCategoria.nombre_categoria}' (ID: ${nuevaCategoria.id}) para el área con ID: ${area_id}`);
    }

    console.log('Categorías insertadas correctamente');
  } catch (error) {
    console.error('Error al insertar categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertarCategorias(); 