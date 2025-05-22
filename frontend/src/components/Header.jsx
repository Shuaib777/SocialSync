import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import React from "react";
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link to={"/"}>
          <IoHome size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt={"logo"}
        src={colorMode == "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        w={6}
      />
      {user && (
        <Link to={`/${user.username}`}>
          <CgProfile size={24} />
        </Link>
      )}
    </Flex>
  );
};

export default Header;
