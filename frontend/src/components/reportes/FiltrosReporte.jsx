import React from "react";
import { RotateCcw, Filter } from "lucide-react";

const FiltrosReporte = ({
  estados,
  areas,
  estadoFiltro,
  setEstadoFiltro,
  areaFiltro,
  setAreaFiltro,
  limpiar,
  onFiltrar,
  cargando,
}) => {
  const [estadoTemp, setEstadoTemp] = React.useState(estadoFiltro);
  const [areaTemp, setAreaTemp] = React.useState(areaFiltro);

  // Sincronizar estados temporales cuando cambien los filtros principales
  React.useEffect(() => {
    setEstadoTemp(estadoFiltro);
    setAreaTemp(areaFiltro);
  }, [estadoFiltro, areaFiltro]);

  const aplicarFiltros = () => {
    console.log("=== APLICAR FILTROS COMPONENTE ===");
    console.log("estadoTemp:", estadoTemp);
    console.log("areaTemp:", areaTemp);
    
    // Actualizar los estados principales
    setEstadoFiltro(estadoTemp);
    setAreaFiltro(areaTemp);
    
    // Pasar los valores directamente a onFiltrar para evitar problemas de timing
    onFiltrar(estadoTemp, areaTemp);
  };

  const resetearFiltros = () => {
    setEstadoTemp("");
    setAreaTemp("");
    limpiar();
  };

  return (
    <div className="reportes-minimal__filtros">
      <div style={{ width: "100%" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
          Filtros
        </h3>
        <p style={{ margin: "4px 0 16px", fontSize: "0.88rem", color: "#666" }}>
          Filtra las inscripciones por diferentes criterios
        </p>
      </div>

      <div className="reportes-minimal__filtro">
        <label>Estado</label>
        <select
          value={estadoTemp}
          onChange={(e) => setEstadoTemp(e.target.value)}
          disabled={cargando}
        >
          <option value="">Todos los estados</option>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="reportes-minimal__filtro">
        <label>Área</label>
        <select
          value={areaTemp}
          onChange={(e) => setAreaTemp(e.target.value)}
          disabled={cargando}
        >
          <option value="">Todas las áreas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.nombre}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="reportes-minimal__acciones">
        <button
          className="boton-con-icono boton-filtrar"
          onClick={aplicarFiltros}
          disabled={cargando}
        >
          <Filter size={16} />
          {cargando ? "Cargando..." : "Filtrar"}
        </button>
        <button
          className="boton-con-icono boton-restablecer"
          onClick={resetearFiltros}
          disabled={cargando}
        >
          <RotateCcw size={16} />
          Restablecer
        </button>
      </div>
    </div>
  );
};

export default FiltrosReporte;
