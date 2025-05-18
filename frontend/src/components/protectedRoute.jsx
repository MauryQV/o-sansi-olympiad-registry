import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Componente para proteger rutas según el rol
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { usuario, isAuthenticated } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Función para obtener el nombre del rol basado en el rol_id
  const getRolName = (rolId) => {
    switch (rolId) {
      case 1:
        return "admin";
      case 2:
        return "competidor";
      case 3:
        return "cajero";
      case 4:
        return "tutor";
      default:
        return null;
    }
  };

  const userRole = getRolName(usuario.rol_id);

  // Si el rol del usuario está permitido, mostrar el componente
  if (allowedRoles.includes(userRole)) {
    return element;
  }

  // Si el rol no está permitido, redirigir a la página principal
  return <Navigate to="/" />;
};

export default ProtectedRoute;
