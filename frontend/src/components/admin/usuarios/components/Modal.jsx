import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Componente Modal reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {string} props.size - Tamaño del modal (sm, md, lg, xl)
 */
const Modal = ({ title, onClose, children, size = "md" }) => {
  // Manejar escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevenir scroll en el body
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restaurar scroll
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Determinar clases de tamaño
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${
          sizeClasses[size] || sizeClasses.md
        } transform transition-all max-h-[90vh] overflow-hidden`}
      >
        {/* Cabecera */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Contenido con scroll si es necesario */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-130px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
