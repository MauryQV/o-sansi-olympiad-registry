import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Importamos la barra de navegación
import Login from "./components/Login";
import InicioAdmin from "./components/InicioAdmin";
//import InicioAdministrador from "./components/InicioAdministrador";
import TablaArea from "./components/TablaArea";
import Disciplinas from "./components/Disciplinas.jsx";
import RegistrarTutores from "./components/RegistrarTutores.jsx";
import RegistroUsuario from "./components/RegistroUsuario.jsx";


function App() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState(() => localStorage.getItem("rol"));
  useEffect(() => {
    if (rol) {
      localStorage.setItem("rol", rol);
    } else {
      localStorage.removeItem("rol");
    }
  }, [rol]);
{/*
  // Dentro del componente App
const AdminRedirect = ({ setIsAdmin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false); // Restablece el estado de administrador
    navigate("/"); // Redirige al inicio
  }, [navigate, setIsAdmin]);

  return null; // No renderiza nada
};
*/}

  useEffect(() => {
    axios
      .get("http://localhost:7777/api/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <Navbar rol={rol} setRol={setRol} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <ul>
                {users.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            }
          />
          <Route path="/inscripciones" element={<RegistroUsuario />} />
          <Route path="/disciplinas" element={<Disciplinas />} />
          <Route path="/acerca" element={<h2>Acerca de nosotros.</h2>} />
          <Route path="/login" element={<Login setRol={setRol} />} />
          <Route path="/inicio-admin" element={<InicioAdmin setRol={setRol} />} />
          <Route path="/areas-admin" element={<TablaArea setRol={setRol} />} />
          <Route path="/registro" element={<RegistroUsuario />} />
        </Routes>
      </div>
    </Router>
   

  );
}

export default App;