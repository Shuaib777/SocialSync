import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import React from "react";
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Search from "./Search";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} mt={6} mb={12}>
      {user && (
        <Link to={"/"}>
          <IoHome size={24} />
        </Link>
      )}
      {user && <Search />}
      <Image
        cursor={"pointer"}
        alt={"logo"}
        src={colorMode == "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        w={6}
      />
      {user && (
        <Link to={"/chat"}>
          <IoChatbubbleEllipsesOutline size={24} />
        </Link>
      )}
      {user && (
        <Link to={`/${user.username}`}>
          <CgProfile size={24} />
        </Link>
      )}
    </Flex>
  );
};

export default Header;
