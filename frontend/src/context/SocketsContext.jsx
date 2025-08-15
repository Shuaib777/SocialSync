import { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io("http://localhost:5000");
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
