import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Importamos la barra de navegación
import Login from "./components/Login";
import InicioAdmin from "./components/InicioAdmin";
import TablaArea from "./components/Areas/TablaArea.jsx";
import RegistroUsuario from "./components/RegistroUsuario.jsx";
import Pagos from "./components/PagosCompetidor/Pagos.jsx";
import DetallePago from "./components/PagosCompetidor/DetallePago.jsx";
import AdminGestionUsuario from "./components/AdminGestionUsuarios/AdminGestionUsuario.jsx";
import RegistroCompetidores from "./components/InscripcionCompetidor/RegistroCompetidores.jsx";
import FormularioInscripcion from "./components/InscripcionCompetidor/FormularioInscripcion.jsx";
import MisInscripciones from "./components/InscripcionCompetidor/MisInscripciones.jsx";
import Reportes from "./components/reportes/Reportes.jsx";
import HistorialConvocatorias from "./components/HistorialConvocatorias.jsx";
import Convocatorias from "./components/Convocatorias/Convocatorias.jsx";
import SolicitudesTutoria from "./components/SolicitudesTutoria.jsx";
import CompetidoresAsignados from "./components/CompetidoresAsignados.jsx";
import InicioTutor from "./components/InicioTutor.jsx";
import InicioCajero from "./components/InicioCajero.jsx";
import ValidadorPagos from "./components/cajero/ValidadorPagos.jsx";
import { GestionUsuarios } from "./components/admin";
//import GestionUsuarios from "./components/admin/GestionUsuarios.jsx";
import Inicio from "./components/Inicio.jsx";
import Areas from "./components/AreasInicio.jsx";
import Acercade from "./components/AcercaDe.jsx";
//import PagosCompetidor from "./components/PagosCompetidor/PagosCompetidor.jsx";
//import PagosCompetidor from "./components/PagosCompetidor/PagosCompetidor.jsx";

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
      <div>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/inscripciones" element={<RegistroUsuario />} />
          <Route path="/disciplinas" element={<HistorialConvocatorias />} />
          <Route path="/acerca" element={<Acercade />} />
          <Route path="/login" element={<Login setRol={setRol} />} />
          <Route
            path="/inicio-admin"
            element={<InicioAdmin setRol={setRol} />}
          />
          <Route path="/areas-admin" element={<TablaArea setRol={setRol} />} />
          <Route
            path="/convocatorias"
            element={<Convocatorias setRol={setRol} />}
          />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/inicio-competidor" element={<RegistroCompetidores />} />
          <Route path="/inscripcion" element={<FormularioInscripcion />} />
          <Route path="/pagos-competidor" element={<Pagos />} />
          <Route
            path="/inscripcion/:convocatoriaId"
            element={<FormularioInscripcion />}
          />
          <Route path="/mis-inscripciones" element={<MisInscripciones />} />
          <Route path="/pagos/detalle/:boleta" element={<DetallePago />} />
          

          <Route
            path="/usuarios"
            element={<AdminGestionUsuario setRol={setRol} />}
          />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/pagos" element={<ValidadorPagos />} />
          <Route
            path="/solicitudes"
            element={<SolicitudesTutoria setRol={setRol} />}
          />
          <Route
            path="/competidores-asignados"
            element={<CompetidoresAsignados />}
          />
          <Route
            path="/inicio-tutor"
            element={<InicioTutor setRol={setRol} />}
          />
          <Route
            path="/inicio-cajero"
            element={<InicioCajero setRol={setRol} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
