import { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import API_URL from "../config/apiConfig";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(API_URL || "http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.emit("register", user._id);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
