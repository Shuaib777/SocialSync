import { Avatar, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const Message = ({ msg }) => {
  const { colorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  return user._id === msg.sender._id ? (
    <Flex alignSelf="flex-end" maxW="70%" gap={2} flexDirection={"row-reverse"}>
      <Avatar
        w="40px"
        h="40px"
        cursor={"pointer"}
        src={user.profilePic}
        name={user.username}
      />
      <Text
        bg={colorMode === "dark" ? "blue.600" : "blue.400"}
        color="white"
        px={3}
        py={2}
        borderRadius="md"
      >
        {msg.text}
      </Text>
    </Flex>
  ) : (
    <Flex alignSelf="flex-start" color="inherit" maxW="70%" gap={2}>
      <Avatar
        w="40px"
        h="40px"
        cursor={"pointer"}
        src={msg.sender.profilePic}
        name={msg.sender.username}
      />
      <Text
        bg={colorMode === "dark" ? "gray.700" : "gray.200"}
        color="white"
        px={3}
        py={2}
        borderRadius={"md"}
      >
        {msg.text}
      </Text>
    </Flex>
  );
};

export default Message;
