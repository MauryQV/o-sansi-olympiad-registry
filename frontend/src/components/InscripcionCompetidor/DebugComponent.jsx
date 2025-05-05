import React, { useEffect, useState } from "react";
import {
  obtenerInfoAcademica,
  obtenerTutoresDisponibles,
} from "../../services/inscripcionService";

const DebugComponent = ({ convocatoriaId }) => {
  const [infoAcademica, setInfoAcademica] = useState(null);
  const [tutores, setTutores] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError(null);
      try {
        // Obtener la URL de la API
        const url = import.meta.env.VITE_API_URL || "http://localhost:7777/api";
        setApiUrl(url);

        // Probar obtención de info académica
        console.log(
          `Obteniendo info académica para convocatoria ID: ${convocatoriaId}`
        );
        const infoResponse = await obtenerInfoAcademica(convocatoriaId);
        setInfoAcademica(infoResponse);

        // Probar obtención de tutores
        console.log("Obteniendo tutores disponibles");
        const tutoresResponse = await obtenerTutoresDisponibles();
        setTutores(tutoresResponse);
      } catch (err) {
        console.error("Error en depuración:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [convocatoriaId]);

  if (cargando) {
    return <div>Cargando datos para depuración...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        margin: "20px 0",
      }}
    >
      <h2>Información de Depuración</h2>
      <div>
        <h3>URL del API:</h3>
        <pre>{apiUrl}</pre>
      </div>

      {error && (
        <div style={{ color: "red" }}>
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      )}

      <div>
        <h3>Información Académica:</h3>
        <pre>{JSON.stringify(infoAcademica, null, 2)}</pre>
      </div>

      <div>
        <h3>Tutores Disponibles:</h3>
        <pre>{JSON.stringify(tutores, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DebugComponent;
