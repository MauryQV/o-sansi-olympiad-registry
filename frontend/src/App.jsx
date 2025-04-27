import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Importamos la barra de navegación
import Login from "./components/Login";
import InicioAdmin from "./components/InicioAdmin";
import TablaArea from "./components/TablaArea";
import Disciplinas from "./components/Disciplinas.jsx";
import RegistrarTutores from "./components/RegistrarTutores.jsx";
import RegistroUsuario from "./components/RegistroUsuario.jsx";
import RegistroCompetidores from "./components/RegistroCompetidores.jsx";
import FormularioInscripcion from "./components/FormularioInscripcion.jsx";
import Pagos from "./components/Pagos.jsx";
import DetallePago from './components/DetallePago';
import Reportes from "./components/Reportes.jsx";
import HistorialConvocatorias from "./components/HistorialConvocatorias.jsx";
function App() {
  const [rol, setRol] = useState(() => localStorage.getItem("rol"));

  useEffect(() => {
    if (rol) {
      localStorage.setItem("rol", rol);
    } else {
      localStorage.removeItem("rol");
    }
  }, [rol]);

  return (
    <Router>
      <Navbar rol={rol} setRol={setRol} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<h2>Bienvenido a la aplicación</h2>} />
          <Route path="/inscripciones" element={<RegistroUsuario />} />
          <Route path="/disciplinas" element={<HistorialConvocatorias />} />
          <Route path="/acerca" element={<h2>Acerca de nosotros.</h2>} />
          <Route path="/login" element={<Login setRol={setRol} />} />
          <Route path="/inicio-admin" element={<InicioAdmin setRol={setRol} />} />
          <Route path="/areas-admin" element={<TablaArea setRol={setRol} />} />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/inicio-competidor" element={<RegistroCompetidores />} />
          <Route path="/inscripcion" element={<FormularioInscripcion />} />
          <Route path="/pagos-competidor" element={<Pagos />} />
          <Route path="/pagos/detalle/:boleta" element={<DetallePago />} />
          <Route path="/reportes" element={<Reportes />} />
          


        </Routes>
      </div>
    </Router>
  );
}

export default App;
