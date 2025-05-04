import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUsuario(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ usuario, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
