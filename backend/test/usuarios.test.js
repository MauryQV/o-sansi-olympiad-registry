import request from 'supertest';
import { expect } from 'chai';
import app from '../src/index.js';
import jwt from 'jsonwebtoken';
import { generarToken } from '../src/utils/jwtUtils.js';

// Mock para el token de administrador
const crearTokenAdmin = () => {
  return generarToken({
    id: '1', // ID de un usuario administrador existente
    rol_id: 1, // Rol de administrador
    correo_electronico: 'admin@test.com'
  });
};

describe('API de Usuarios', () => {
  let token;
  let usuarioIdCreado;

  before(() => {
    // Crear un token para las pruebas
    token = crearTokenAdmin();
  });

  describe('GET /api/usuarios', () => {
    it('debería obtener todos los usuarios si el token es válido', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', token);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });

    it('debería rechazar la petición si no hay token', async () => {
      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).to.equal(401);
    });
  });

  describe('GET /api/usuarios/roles', () => {
    it('debería obtener todos los roles si el token es válido', async () => {
      const response = await request(app)
        .get('/api/usuarios/roles')
        .set('Authorization', token);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  describe('POST /api/usuarios', () => {
    it('debería crear un nuevo usuario si los datos son válidos', async () => {
      const nuevoUsuario = {
        nombre: 'Usuario',
        apellido: 'Test',
        correo_electronico: `test${Date.now()}@example.com`,
        password: 'password123',
        rol_id: 2, // Rol no administrador
        carnet_identidad: `${Date.now()}`
      };

      const response = await request(app)
        .post('/api/usuarios')
        .set('Authorization', token)
        .send(nuevoUsuario);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.nombre).to.equal(nuevoUsuario.nombre);
      expect(response.body.apellido).to.equal(nuevoUsuario.apellido);
      expect(response.body.correo_electronico).to.equal(nuevoUsuario.correo_electronico);
      expect(response.body).to.not.have.property('password'); // No debe devolver la contraseña

      // Guardar el ID para usarlo en pruebas posteriores
      usuarioIdCreado = response.body.id;
    });

    it('debería rechazar la creación si faltan datos', async () => {
      const usuarioIncompleto = {
        nombre: 'Usuario Incompleto',
        // Faltan campos requeridos
      };

      const response = await request(app)
        .post('/api/usuarios')
        .set('Authorization', token)
        .send(usuarioIncompleto);

      expect(response.status).to.equal(400);
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('debería obtener un usuario por su ID si existe', async () => {
      // Usar el ID del usuario creado previamente
      const response = await request(app)
        .get(`/api/usuarios/${usuarioIdCreado}`)
        .set('Authorization', token);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id', usuarioIdCreado);
    });

    it('debería devolver 404 si el usuario no existe', async () => {
      const response = await request(app)
        .get('/api/usuarios/id-inexistente')
        .set('Authorization', token);

      expect(response.status).to.equal(404);
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('debería actualizar un usuario existente', async () => {
      const datosActualizacion = {
        nombre: 'Nombre Actualizado',
        apellido: 'Apellido Actualizado',
        correo_electronico: `actualizado${Date.now()}@example.com`,
        rol_id: 2
      };

      const response = await request(app)
        .put(`/api/usuarios/${usuarioIdCreado}`)
        .set('Authorization', token)
        .send(datosActualizacion);

      expect(response.status).to.equal(200);
      expect(response.body.nombre).to.equal(datosActualizacion.nombre);
      expect(response.body.apellido).to.equal(datosActualizacion.apellido);
    });
  });

  describe('PATCH /api/usuarios/:id/status', () => {
    it('debería cambiar el estado de un usuario', async () => {
      const response = await request(app)
        .patch(`/api/usuarios/${usuarioIdCreado}/status`)
        .set('Authorization', token)
        .send({ estado: false });

      expect(response.status).to.equal(200);
      expect(response.body.estado).to.equal(false);
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('debería eliminar un usuario existente', async () => {
      const response = await request(app)
        .delete(`/api/usuarios/${usuarioIdCreado}`)
        .set('Authorization', token);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message').that.includes('eliminado');
    });

    it('debería devolver 404 al intentar eliminar un usuario inexistente', async () => {
      const response = await request(app)
        .delete(`/api/usuarios/${usuarioIdCreado}`) // Ya fue eliminado
        .set('Authorization', token);

      expect(response.status).to.equal(404);
    });
  });
}); 