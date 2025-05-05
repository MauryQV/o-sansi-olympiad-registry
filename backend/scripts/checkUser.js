import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function checkUser(email, password) {
  try {
    console.log("Verificando usuario...");
    console.log("Email a buscar:", email);
    
    // Buscar usuarios con este email
    const users = await prisma.usuario.findMany({
      where: {
        correo_electronico: {
          contains: email,
          mode: 'insensitive'
        }
      }
    });
    
    console.log(`\nEncontrados ${users.length} usuarios con email similar a "${email}":`);
    
    if (users.length === 0) {
      console.log("No se encontró ningún usuario con ese email.");
      console.log("\nLista de usuarios en la base de datos:");
      
      const allUsers = await prisma.usuario.findMany({
        select: {
          id: true,
          correo_electronico: true,
          nombre: true,
          apellido: true
        }
      });
      
      allUsers.forEach(u => {
        console.log(`- ${u.correo_electronico} (${u.nombre} ${u.apellido})`);
      });
      
      return;
    }
    
    // Analizar cada usuario encontrado
    for (const user of users) {
      console.log("\n===================================");
      console.log(`Usuario: ${user.nombre} ${user.apellido}`);
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.correo_electronico}`);
      console.log(`Password almacenado: ${user.password}`);
      
      // Verificar si la contraseña es un hash de bcrypt
      const isBcryptHash = user.password.startsWith('$2');
      console.log(`¿Es hash bcrypt? ${isBcryptHash ? 'Sí' : 'No'}`);
      
      // Si no es un hash, probar con comparación directa
      if (!isBcryptHash) {
        const directMatch = password === user.password;
        console.log(`Comparación directa: ${directMatch ? 'Exitosa' : 'Fallida'}`);
      }
      
      // Si es un hash, intentar verificar con bcrypt
      if (isBcryptHash) {
        try {
          const isValid = await bcrypt.compare(password, user.password);
          console.log(`Verificación bcrypt: ${isValid ? 'Exitosa' : 'Fallida'}`);
        } catch (error) {
          console.log(`Error en bcrypt.compare: ${error.message}`);
        }
      }
      
      // Crear un hash nuevo para mostrar cómo debería verse
      const newHash = await bcrypt.hash(password, 10);
      console.log(`Nuevo hash para esta contraseña: ${newHash}`);
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Email y contraseña a verificar
const email = process.argv[2] || 'competidor1@test.com';
const password = process.argv[3] || 'test';

console.log(`Verificando usuario con email: "${email}" y contraseña: "${password}"`);
checkUser(email, password); 