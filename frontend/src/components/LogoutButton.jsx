import { Button, useToast } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const LogoutButton = () => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://socialsync-backend.onrender.com"
      : "";

  const setUser = useSetRecoilState(userAtom);
  const toast = useToast();
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        toast({
          title: "Logout Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setUser(null);
      localStorage.removeItem("user-posts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
