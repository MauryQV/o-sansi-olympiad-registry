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
      </div>
    </div>
  );
};

export default InicioAdmin;
