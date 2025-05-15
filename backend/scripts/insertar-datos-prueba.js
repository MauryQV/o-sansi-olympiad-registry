import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando inserción de datos de prueba...');

    // 1. Verificar y crear roles si es necesario
    console.log('Verificando roles necesarios...');
    const rolesDefinicion = [
      { id: 1, nombre: 'admin' },
      { id: 2, nombre: 'competidor' },
      { id: 3, nombre: 'cajero' },
      { id: 4, nombre: 'tutor' }
    ];
    
    // Crear todos los roles necesarios
    for (const rol of rolesDefinicion) {
      await prisma.rol.upsert({
        where: { id: rol.id },
        update: { nombre: rol.nombre },
        create: rol
      });
    }
    
    console.log('Roles creados o verificados');
    
    // 2. Verificar y crear usuarios admin y cajero para pruebas
    const usuariosAdminCajero = await prisma.usuario.findMany({
      where: {
        OR: [
          { correo_electronico: 'admin@test.com' },
          { correo_electronico: 'cajero@test.com' }
        ]
      }
    });

    if (usuariosAdminCajero.length < 2) {
      console.log('Creando usuarios admin y cajero para pruebas...');
      
      // Obtener los roles directamente desde la base de datos
      const rolesDisponibles = await prisma.rol.findMany();
      console.log('Roles disponibles:', rolesDisponibles.map(r => `${r.id}:${r.nombre}`).join(', '));
      
      const adminRol = rolesDisponibles.find(r => r.nombre === 'admin');
      const cajeroRol = rolesDisponibles.find(r => r.nombre === 'cajero');
      
      if (!adminRol || !cajeroRol) {
        throw new Error('Roles admin o cajero no encontrados después de crearlos');
      }
      
      // Crear usuario admin si no existe
      if (!usuariosAdminCajero.find(u => u.correo_electronico === 'admin@test.com')) {
        await prisma.usuario.create({
          data: {
            id: randomUUID(),
            correo_electronico: 'admin@test.com',
            nombre: 'Administrador',
            apellido: 'Sistema',
            password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
            rol_id: adminRol.id
          }
        });
        console.log('Usuario admin creado');
      }
      
      // Crear usuario cajero si no existe
      if (!usuariosAdminCajero.find(u => u.correo_electronico === 'cajero@test.com')) {
        await prisma.usuario.create({
          data: {
            id: randomUUID(),
            correo_electronico: 'cajero@test.com',
            nombre: 'Cajero',
            apellido: 'Sistema',
            password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
            rol_id: cajeroRol.id
          }
        });
        console.log('Usuario cajero creado');
      }
    }

    // 3. Verificar si ya existen usuarios competidores
    const usuariosExistentes = await prisma.usuario.findMany({
      where: {
        OR: [
          { correo_electronico: 'competidor1@test.com' },
          { correo_electronico: 'competidor2@test.com' },
          { correo_electronico: 'competidor3@test.com' },
          { correo_electronico: 'competidor4@test.com' },
          { correo_electronico: 'competidor5@test.com' }
        ]
      }
    });

    if (usuariosExistentes.length >= 5) {
      console.log('Ya existen suficientes usuarios competidores de prueba. Saltando creación de competidores.');
      
      // Verificar si existen inscripciones para Robótica y Matemáticas
      const inscripcionesRobotica = await prisma.inscripcion.findFirst({
        where: {
          area: {
            nombre_area: "Robótica"
          }
        }
      });
      
      const inscripcionesMate = await prisma.inscripcion.findFirst({
        where: {
          area: {
            nombre_area: "Matemáticas"
          }
        }
      });
      
      if (inscripcionesRobotica && inscripcionesMate) {
        console.log('Ya existen inscripciones para Robótica y Matemáticas. No se crearán nuevas.');
        console.log('¡Datos de prueba insertados correctamente!');
        return;
      }
      
      console.log('Faltan inscripciones para Robótica o Matemáticas. Creando...');
    }

    // 4. Crear áreas (si no existen)
    console.log('Creando áreas...');
    const areas = [
      { nombre_area: 'Robótica', descripcion_area: 'Área de robótica educativa', costo: 150.00 },
      { nombre_area: 'Física', descripcion_area: 'Área de física', costo: 120.00 },
      { nombre_area: 'Matemáticas', descripcion_area: 'Área de matemáticas', costo: 100.00 }
    ];

    const areasCreadas = [];
    for (const area of areas) {
      // Verificar si el área ya existe
      let areaExistente = await prisma.area.findFirst({
        where: { nombre_area: area.nombre_area }
      });
      
      if (!areaExistente) {
        areaExistente = await prisma.area.create({
          data: area
        });
        console.log(`Área ${area.nombre_area} creada`);
      } else {
        console.log(`Área ${area.nombre_area} ya existe`);
      }
      areasCreadas.push(areaExistente);
    }

    console.log('Áreas creadas o verificadas');

    // 5. Crear categorías (si no existen)
    console.log('Creando niveles, grados y categorías...');
    // Primero asegurarse de que existan niveles y grados
    const nivelPrimaria = await prisma.nivel.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre_nivel: 'Primaria' }
    });

    const nivelSecundaria = await prisma.nivel.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, nombre_nivel: 'Secundaria' }
    });

    // Crear grados
    const gradoMin = await prisma.grado.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre_grado: '1ro Primaria', id_nivel: nivelPrimaria.id }
    });

    const gradoMax = await prisma.grado.upsert({
      where: { id: 6 },
      update: {},
      create: { id: 6, nombre_grado: '6to Primaria', id_nivel: nivelPrimaria.id }
    });

    // Crear categorías
    const categoria = await prisma.categoria.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nombre_categoria: 'Primaria Básica',
        grado_min_id: gradoMin.id,
        grado_max_id: gradoMax.id,
        descripcion_cat: 'Categoría para nivel primario'
      }
    });

    console.log('Categorías creadas o verificadas');

    // 6. Crear convocatoria (si no existe)
    console.log('Creando convocatoria...');
    const estadoConvocatoria = await prisma.estado_convocatoria.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre: 'Activa' }
    });

    const convocatoria = await prisma.convocatoria.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nombre_convocatoria: 'Olimpiadas 2025',
        id_estado_convocatoria: estadoConvocatoria.id,
        fecha_inicio: new Date('2025-01-01'),
        fecha_fin: new Date('2025-12-31'),
        pago_inicio: new Date('2025-01-01'),
        pago_fin: new Date('2025-06-30'),
        competicion_inicio: new Date('2025-07-01'),
        competicion_fin: new Date('2025-12-01'),
        descripcion_convocatoria: 'Convocatoria para olimpiadas científicas 2025'
      }
    });

    console.log('Convocatoria creada o verificada');

    // 7. Crear departamento, provincia y colegio (si no existen)
    console.log('Creando ubicaciones...');
    const departamento = await prisma.departamento.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre_departamento: 'La Paz' }
    });

    const provincia = await prisma.provincia.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nombre_provincia: 'Murillo',
        departamento_id: departamento.id
      }
    });

    const colegio = await prisma.colegio.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nombre_colegio: 'Colegio San Francisco',
        provincia_id: provincia.id
      }
    });

    console.log('Departamento, provincia y colegio creados o verificados');

    // 8. Crear usuarios competidores
    console.log('Creando competidores...');
    const todosLosRoles = await prisma.rol.findMany();
    const rolCompetidor = todosLosRoles.find(r => r.nombre === 'competidor');

    if (!rolCompetidor) {
      throw new Error('Rol de competidor no encontrado');
    }

    const usuariosCompetidores = [
      {
        id: randomUUID(),
        correo_electronico: 'competidor1@test.com',
        nombre: 'Ana',
        apellido: 'García',
        password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
        rol_id: rolCompetidor.id
      },
      {
        id: randomUUID(),
        correo_electronico: 'competidor2@test.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
        rol_id: rolCompetidor.id
      },
      {
        id: randomUUID(),
        correo_electronico: 'competidor3@test.com',
        nombre: 'María',
        apellido: 'López',
        password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
        rol_id: rolCompetidor.id
      },
      {
        id: randomUUID(),
        correo_electronico: 'competidor4@test.com',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
        rol_id: rolCompetidor.id
      },
      {
        id: randomUUID(),
        correo_electronico: 'competidor5@test.com',
        nombre: 'Laura',
        apellido: 'Martínez',
        password: '$2a$10$XncVy3dLw0QQ3YK1xMSxOuyG0Nd.E9HlVZDIkD4HOJeWpbyBFW1xq', // "password123"
        rol_id: rolCompetidor.id
      }
    ];

    // 9. Crear competidores y sus inscripciones
    console.log('Creando inscripciones...');
    // Filtrar los usuarios que ya existen
    const usuariosExistentesEmails = usuariosExistentes.map(u => u.correo_electronico);
    const nuevosUsuarios = usuariosCompetidores.filter(u => !usuariosExistentesEmails.includes(u.correo_electronico));
    
    // Buscar áreas por nombre
    const areaRobotica = await prisma.area.findFirst({
      where: { nombre_area: 'Robótica' }
    });
    
    const areaMate = await prisma.area.findFirst({
      where: { nombre_area: 'Matemáticas' }
    });
    
    // Verificar si ya existen inscripciones para estas áreas
    const inscripcionRobotica = await prisma.inscripcion.findFirst({
      where: { area_id: areaRobotica?.id }
    });
    
    const inscripcionMate = await prisma.inscripcion.findFirst({
      where: { area_id: areaMate?.id }
    });
    
    for (const [index, userData] of nuevosUsuarios.entries()) {
      // Crear usuario
      const usuario = await prisma.usuario.create({
        data: userData
      });

      // Crear competidor
      const competidor = await prisma.competidor.create({
        data: {
          id: randomUUID(),
          usuario_id: usuario.id,
          colegio_id: colegio.id,
          provincia_id: provincia.id,
          carnet_identidad: `123456-${index}A`,
          fecha_nacimiento: new Date('2010-01-01')
        }
      });

      // Crear inscripción para cada competidor con diferentes estados y áreas
      const estados = ['Pendiente', 'Completado', 'Cancelado'];
      const areasCreadas = await prisma.area.findMany();
      
      const areaSeleccionada = areasCreadas[index % areasCreadas.length];
      const estadoSeleccionado = estados[index % estados.length];

      await prisma.inscripcion.create({
        data: {
          competidor_id: competidor.id,
          area_id: areaSeleccionada.id,
          convocatoria_id: convocatoria.id,
          categoria_id: categoria.id,
          fecha_inscripcion: new Date(),
          estado_inscripcion: estadoSeleccionado
        }
      });
    }
    
    // Crear inscripciones específicas para Robótica y Matemáticas si no existen
    if (!inscripcionRobotica && areaRobotica) {
      // Buscar un competidor existente o crear uno nuevo
      const competidores = await prisma.competidor.findMany({ take: 1 });
      
      if (competidores.length > 0) {
        await prisma.inscripcion.create({
          data: {
            competidor_id: competidores[0].id,
            area_id: areaRobotica.id,
            convocatoria_id: convocatoria.id,
            categoria_id: categoria.id,
            fecha_inscripcion: new Date(),
            estado_inscripcion: 'Pendiente'
          }
        });
        console.log('Inscripción para Robótica creada');
      }
    }
    
    if (!inscripcionMate && areaMate) {
      // Buscar un competidor existente o crear uno nuevo
      const competidores = await prisma.competidor.findMany({ 
        orderBy: { id: 'desc' },
        take: 1 
      });
      
      if (competidores.length > 0) {
        await prisma.inscripcion.create({
          data: {
            competidor_id: competidores[0].id,
            area_id: areaMate.id,
            convocatoria_id: convocatoria.id,
            categoria_id: categoria.id,
            fecha_inscripcion: new Date(),
            estado_inscripcion: 'Completado'
          }
        });
        console.log('Inscripción para Matemáticas creada');
      }
    }

    console.log('Usuarios, competidores e inscripciones creados con éxito');
    console.log('¡Datos de prueba insertados correctamente!');

  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 