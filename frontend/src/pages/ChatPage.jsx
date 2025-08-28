import React, { useEffect, useState } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import ChatList from "../components/ChatList";
import MessageContainer from "../components/MessageContainer";

const ChatPage = ({ setChatSelected }) => {
  const [userSelected, setUserSelected] = useState(null);
  const [conversationSelected, setConversationSelected] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Detect if we are on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  useEffect(() => {
    if (isMobile) {
      if (userSelected) setChatSelected(true);
      else setChatSelected(false);
    }
  }, [userSelected]);

  return (
    <Box
      position="absolute"
      left="50%"
      transform="translateX(-50%)"
      w={{ base: "100%", md: "750px" }}
      h={{ base: "96vh", md: "550px" }}
      overflow="hidden"
    >
      <Flex h="100%">
        {/* Small screen behavior */}
        {isMobile ? (
          userSelected ? (
            <MessageContainer
              userSelected={userSelected}
              conversationSelected={conversationSelected}
              setConversations={setConversations}
              setUserSelected={setUserSelected}
            />
          ) : (
            <ChatList
              setUserSelected={setUserSelected}
              setConversationSelected={setConversationSelected}
              conversations={conversations}
              setConversations={setConversations}
            />
          )
        ) : (
          // Medium+ screen behavior (always both side by side)
          <>
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
          </>
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
