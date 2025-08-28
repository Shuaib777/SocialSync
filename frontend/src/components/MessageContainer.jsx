import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Skeleton,
  SkeletonCircle,
  useColorMode,
  Avatar,
  Input,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import Message from "./Message";
import { useSocket } from "../context/SocketsContext";
import { useMessages } from "../hooks/useMessages";
import { useSeenMessages } from "../hooks/useSeenMessages";
import { useSocketMessages } from "../hooks/useSocketMessages";
import useApi from "../hooks/useApi";

const MessageContainer = ({
  userSelected,
  conversationSelected,
  setConversations,
  setUserSelected,
}) => {
  const { colorMode } = useColorMode();
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const messagesContainerRef = useRef();
  const [userSelectedStatus, setUserSelectedStatus] = useState(false);
  const request = useApi();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { messages, setMessages, messagesLoading, firstLoad } =
    useMessages(userSelected); // this all are useEffect hooks

  useSeenMessages(conversationSelected, setConversations);

  const { pendingSeenEvents, setPendingSeenEvents } = useSocketMessages({
    socket,
    userSelected,
    conversationSelected,
    setMessages,
    setConversations,
    setUserSelectedStatus,
  });

  // Handle scroll to bottom
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: firstLoad.current ? "auto" : "smooth",
    });
    if (firstLoad.current) firstLoad.current = false;
  }, [messages]);

  // Handle plugging in pending seen events
  useEffect(() => {
    if (pendingSeenEvents.length === 0) return;

    let stillPendingEvents = [...pendingSeenEvents];
    let wasStateUpdated = false;

    const updatedMessages = messages.map((msg) => {
      const eventForThisMsg = stillPendingEvents.find(
        (event) => event.messageId === msg._id
      );

      if (eventForThisMsg) {
        wasStateUpdated = true;
        stillPendingEvents = stillPendingEvents.filter(
          (event) => event.messageId !== msg._id
        );

        const seenByArray = msg.seenBy || [];
        return {
          ...msg,
          seenBy: [
            ...seenByArray,
            { user: eventForThisMsg.seenBy, seenAt: new Date() },
          ],
        };
      }
      return msg;
    });

    if (wasStateUpdated) {
      setMessages(updatedMessages);
      setPendingSeenEvents(stillPendingEvents);
    }
  }, [messages, pendingSeenEvents]);

  const handleText = async () => {
    if (!userSelected) return;

    const data = await request(
      "/chat/createMessage",
      "POST",
      { text, recipientId: userSelected._id },
      false,
      true
    );
    if (!data) return;

    setMessages((prev) => [...prev, data]);
    setConversations((prev) => {
      const updated = prev.map((convo) =>
        convo._id === conversationSelected._id
          ? {
              ...convo,
              lastMessage: { ...convo.lastMessage, text: data.text },
              unreadCount: 0,
            }
          : convo
      );

      const convoToMove = updated.find(
        (c) => c._id === conversationSelected._id
      );
      return [
        convoToMove,
        ...updated.filter((c) => c._id !== conversationSelected._id),
      ];
    });

    setText("");
  };

  return (
    <Flex
      flex={{ base: "1", md: "60%" }}
      direction="column"
      h="100%"
      borderLeft={{ base: "none", md: "1px solid" }}
      borderColor="gray.700"
    >
      {userSelected ? (
        <>
          {/* Header */}
          <Flex
            align="center"
            bg={colorMode === "dark" ? "gray.900" : "gray.200"}
            p={4}
            justifyContent="space-between"
          >
            <Flex alignItems="center" gap={4}>
              {/* Back button only on mobile */}
              {isMobile && (
                <IconButton
                  aria-label="Back"
                  icon={<IoArrowBack />}
                  size="xs"
                  variant="ghost"
                  mr={"-10px"}
                  onClick={() => setUserSelected(null)}
                />
              )}
              <Avatar
                w="40px"
                h="40px"
                src={userSelected.profilePic}
                name={userSelected.username}
              />
              <Box>
                <Text fontWeight="bold">{userSelected.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  {userSelectedStatus ? "Active" : "Inactive"}
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* Messages */}
          <VStack
            flex={1}
            w="100%"
            overflowY="auto"
            p={4}
            spacing={6}
            ref={messagesContainerRef}
          >
            {messagesLoading
              ? [0, 1, 1, 0, 0, 1].map((ele, i) => (
                  <Flex
                    key={i}
                    align="center"
                    gap={3}
                    alignSelf={ele ? "flex-start" : "flex-end"}
                  >
                    <SkeletonCircle size="10" />
                    <Box flex="1">
                      <Skeleton height="10px" mb={2} width="100px" />
                      <Skeleton height="8px" width="80px" />
                    </Box>
                  </Flex>
                ))
              : messages.map((msg, i) => <Message key={i} msg={msg} />)}
          </VStack>

          {/* Input */}
          <Flex
            borderTop="1px solid"
            borderColor="gray.700"
            bg={colorMode === "dark" ? "gray.800" : "gray.100"}
            gap={2}
            p={2}
          >
            <Input
              placeholder="Type a message..."
              size="sm"
              border="none"
              flex={1}
              outline="none"
              focusBorderColor="transparent"
              _focus={{ boxShadow: "none" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleText()}
            />
            <Flex alignItems="center" justifyContent="center" p={2} gap={4}>
              <FaRegImage cursor="pointer" />
              <IoSendSharp cursor="pointer" onClick={handleText} />
            </Flex>
          </Flex>
        </>
      ) : (
        <VStack alignItems="center" justifyContent="center" height="100%">
          <IoIosMail size={40} />
          <Text>Select A User</Text>
        </VStack>
      )}
    </Flex>
  );
};

export default MessageContainer;
