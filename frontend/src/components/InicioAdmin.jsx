import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaChartBar,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const InicioAdmin = ({ setRol }) => {
  useEffect(() => {
    // Cambiar el estado del rol para indicar que es administrador
    if (setRol) {
      setRol("admin");
    }
  }, [setRol]);

  // Tarjetas de navegación para las diferentes secciones de administración
  const tarjetas = [
    {
      id: 1,
      titulo: "Gestión de Usuarios",
      descripcion: "Administrar usuarios, roles y permisos",
      icono: <FaUsers size={30} />,
      ruta: "/admin/usuarios",
      color: "bg-blue-500",
    },
    {
      id: 2,
      titulo: "Convocatorias",
      descripcion: "Gestionar convocatorias y eventos",
      icono: <FaCalendarAlt size={30} />,
      ruta: "/convocatorias",
      color: "bg-green-500",
    },
    {
      id: 3,
      titulo: "Áreas de Olimpiada",
      descripcion: "Administrar áreas y categorías",
      icono: <FaTrophy size={30} />,
      ruta: "/areas-admin",
      color: "bg-amber-500",
    },
    {
      id: 4,
      titulo: "Pagos",
      descripcion: "Verificar y gestionar pagos",
      icono: <FaFileInvoiceDollar size={30} />,
      ruta: "/pagos",
      color: "bg-purple-500",
    },
    {
      id: 5,
      titulo: "Reportes",
      descripcion: "Ver estadísticas e informes",
      icono: <FaChartBar size={30} />,
      ruta: "/reportes",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
        <p className="text-gray-600">
          Bienvenido al panel de administración del sistema. Desde aquí podrás
          gestionar todos los aspectos de la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarjetas.map((tarjeta) => (
          <Link
            key={tarjeta.id}
            to={tarjeta.ruta}
            className="block transition-transform hover:scale-105"
          >
            <div
              className={`rounded-lg shadow-lg overflow-hidden h-full ${tarjeta.color}`}
            >
              <div className="p-6 text-white">
                <div className="flex items-center mb-4">
                  {tarjeta.icono}
                  <h2 className="text-xl font-bold ml-3">{tarjeta.titulo}</h2>
                </div>
                <p className="opacity-90">{tarjeta.descripcion}</p>
              </div>
            </div>
          </Link>
        ))}
=======

import React, { useEffect, useState } from 'react';
import '../styles/InicioAdmin.css';

const InicioAdmin = () => {
  const [estadisticas, setEstadisticas] = useState({
    areas: 0,
    convocatorias: 0,
    competidores: 0,
    inscripciones: 0,
  });
  const [convocatoriasRecientes, setConvocatoriasRecientes] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    // simu
    setTimeout(() => {
      setEstadisticas({
        areas: 7,
        convocatorias: 1,
        competidores: 5,
        inscripciones: 5,
      });

      setConvocatoriasRecientes([
        {
          nombre: 'Olimpiada Científica Estudiantil 2025',
          descripcion: 'Convocatoria anual para las olimpiadas científicas a nivel departamental.',
          fecha_inicio: '2025-03-01',
          fecha_fin: '2025-05-31',
          estado: 'En inscripción'
        },
        {
          nombre: 'Olimpiada Científica Estudiantil 2024',
          descripcion: 'Convocatoria anual para las olimpiadas científicas a nivel departamental.',
          fecha_inicio: '2024-03-01',
          fecha_fin: '2024-05-31',
          estado: 'Finalizado'
        }
      ]);

      setAreas([
        { nombre: 'Matemática', descripcion: 'Olimpiada de Matemática con énfasis en el razonamiento lógico y numérico.' },
        { nombre: 'Robótica', descripcion: 'Competencia de diseño, construcción y programación de robots.' },
        { nombre: 'Astronomía y Astrofísica', descripcion: 'Estudio de cuerpos celestes y fenómenos del universo observable.' },
        { nombre: 'Biología', descripcion: 'Competencia sobre los principios fundamentales de la biología celular y molecular.' },
        { nombre: 'Química', descripcion: 'Olimpiada centrada en principios químicos y solución de problemas experimentales.' },
        { nombre: 'Física', descripcion: 'Competencia sobre los principios físicos, leyes del movimiento y termodinámica.' },
        { nombre: 'Informática', descripcion: 'Desafíos de programación, algoritmos y estructuras de datos.' }
      ]);
    }, 500);
  }, []);

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>
      <div className="admin-resumen">
        <div className="admin-box">Áreas Científicas<br/><span>{estadisticas.areas}</span></div>
        <div className="admin-box">Convocatorias Activas<br/><span>{estadisticas.convocatorias}</span></div>
        <div className="admin-box">Total Competidores<br/><span>{estadisticas.competidores}</span></div>
        <div className="admin-box">Inscripciones<br/><span>{estadisticas.inscripciones}</span></div>
      </div>

      <div className="admin-contenido">
        <div className="admin-card">
          <h3>Convocatorias Recientes</h3>
          <div className="admin-lista">
            {convocatoriasRecientes.map((c, i) => (
              <div key={i} className="convocatoria-item">
                <strong>{c.nombre}</strong>
                <p>{c.descripcion}</p>
                <p>Inscripción: {c.fecha_inicio} - {c.fecha_fin}</p>
                <div className="convocatoria-reciente-estado"> 
                  <span className={`estado-tag ${c.estado.toLowerCase().replace(/\s+/g, '-')}`}>{c.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>Áreas de Competencia</h3>
          <div className="admin-lista-scroll">
            {areas.map((a, i) => (
              <div key={i} className="area-item">
                <strong>{a.nombre}</strong>
                <p>{a.descripcion.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioAdmin;
