import React from "react";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import ChatList from "../components/ChatList";
import MessageContainer from "../components/MessageContainer";

const ChatPage = () => {
  const [userSelected, setUserSelected] = useState(null);

  return (
    <Box
      position="absolute"
      left="50%"
      transform="translateX(-50%)"
      w="750px"
      h={"550px"}
      //   border="1px solid"
      //   borderColor="gray.700"
    >
      <Flex direction={{ base: "column", md: "row" }} h={"100%"}>
        <ChatList setUserSelected={setUserSelected} />
        <MessageContainer userSelected={userSelected} />
      </Flex>
    </Box>
  );
};

export default ChatPage;
