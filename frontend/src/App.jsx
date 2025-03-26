import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Importamos la barra de navegación
import InicioAdministrador from "./components/InicioAdministrador";
import TablaArea from "./components/TablaArea";


import './styles/Navbar.css'


function App() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // Dentro del componente App
const AdminRedirect = ({ setIsAdmin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false); // Restablece el estado de administrador
    navigate("/"); // Redirige al inicio
  }, [navigate, setIsAdmin]);

  return null; // No renderiza nada
};

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
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin}/> 
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
              <Route path="/inscripciones" element={<h1>inscripciones</h1>} />
              <Route path="/disciplinas" element={<h1>disciplinas</h1>} />
              <Route path="/ingresar" element={<InicioAdministrador setIsAdmin={setIsAdmin} />} />
              <Route path="/admin" element={<AdminRedirect setIsAdmin={setIsAdmin} />} />
              <Route path="/registrar-disciplinas" element={<TablaArea />} />
            </Routes>
          </div>
      </Router>
   

  );
}

export default App;