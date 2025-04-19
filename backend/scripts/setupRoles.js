import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setupRoles() {
    try {
        console.log('Configurando roles básicos...');
        
        // Definir roles básicos
        const rolesBasicos = [
            { nombre: 'admin' },
            { nombre: 'tutor' },
            { nombre: 'competidor' },
            { nombre: 'cajero' }
        ];
        
        // Insertar o actualizar roles
        for (const rol of rolesBasicos) {
            const rolExistente = await prisma.rol.findFirst({
                where: { nombre: rol.nombre }
            });
            
            if (!rolExistente) {
                await prisma.rol.create({
                    data: rol
                });
                console.log(`Rol '${rol.nombre}' creado exitosamente`);
            } else {
                console.log(`Rol '${rol.nombre}' ya existe`);
            }
        }
        
        console.log('Configuración de roles completada');
    } catch (error) {
        console.error('Error configurando roles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el script
setupRoles()
    .then(() => console.log('Script finalizado'))
    .catch(e => console.error('Error en script:', e)); 