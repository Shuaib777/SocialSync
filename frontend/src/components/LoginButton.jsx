import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const LoginButton = () => {
  return (
    <Link to="/auth">
      <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"}>
        Login
      </Button>
    </Link>
  );
};

export default LoginButton;
