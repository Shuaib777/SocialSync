import React from "react";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import ChatList from "../components/ChatList";
import MessageContainer from "../components/MessageContainer";

const ChatPage = () => {
  const [userSelected, setUserSelected] = useState(null);
  const [conversationSelected, setConversationSelected] = useState(null);
  const [conversations, setConversations] = useState([]);

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
        <ChatList
          setUserSelected={setUserSelected}
          setConversationSelected={setConversationSelected}
          conversations={conversations}
          setConversations={setConversations}
        />
        <MessageContainer
          userSelected={userSelected}
          conversationSelected={conversationSelected}
          setConversations={setConversations}
        />
      </Flex>
    </Box>
  );
};

export default ChatPage;
