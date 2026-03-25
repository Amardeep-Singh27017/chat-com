import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);

  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser?._id) {
      const SOCKET_URL =
        import.meta.env.MODE === "development"
          ? "http://localhost:5000"
          : "https://chat-app-htcu.onrender.com";

      const newSocket = io(SOCKET_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
