import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario && usuario.id) {
      // Conectar al servidor websocket
      const socketConnection = io("http://localhost:7777"); //url del servidor websocket

      // registrar el usuario al conectarse
      socketConnection.on("connect", () => {
        console.log("Conectado al servidor de websockets");
        socketConnection.emit("registrar_usuario", usuario.id);
      });

      setSocket(socketConnection);

      // Limpiar al desmontar
      return () => {
        socketConnection.disconnect();
      };
    }
  }, [usuario]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
