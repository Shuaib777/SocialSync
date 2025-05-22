import { Button, useToast } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useApi from "../hooks/useApi";
import useCustomToast from "../hooks/useCustomToast";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useCustomToast();
  const request = useApi();

  const handleLogout = async () => {
    try {
      const data = await request("/users/logout", "POST", null, false, true);
      if (!data) return;
      setUser(null);
      localStorage.removeItem("user-posts");
    } catch (err) {
      showToast("Error", "User not logged out", "error");
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
