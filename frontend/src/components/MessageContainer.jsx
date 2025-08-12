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
  Button,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { IoSendSharp } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa6";
import Message from "./Message";
import useApi from "../hooks/useApi";
import { IoIosMail } from "react-icons/io";

const MessageContainer = ({ userSelected }) => {
  const { colorMode } = useColorMode();
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const request = useApi();
  const messagesContainerRef = useRef();
  const firstLoad = useRef();

  useEffect(() => {
    setMessages([]);
    const getMessages = async () => {
      if (!userSelected) return;
      setMessagesLoading(true);
      const data = await request(`/chat/getMessages/${userSelected._id}`);
      setMessagesLoading(false);

      if (!data) return;
      setMessages(data);
      firstLoad.current = true;
    };
    getMessages();
  }, [userSelected]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: firstLoad.current ? "auto" : "smooth",
    });

    if (firstLoad.current) firstLoad.current = false;
  }, [messages]);

  const handleText = async () => {
    if (!userSelected) return;

    const data = await request("/chat/createMessage", "POST", {
      text,
      recipientId: userSelected._id,
    });
    if (!data) return;
    setMessages((prev) => [...prev, data]);
    setText("");
  };

  return (
    <Flex flex="60%" direction="column" h="100%">
      {userSelected ? (
        <>
          <Flex
            align="center"
            bg="gray.900"
            p={4}
            justifyContent={"space-between"}
          >
            <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
              <Avatar
                w="40px"
                h="40px"
                cursor={"pointer"}
                src={userSelected.profilePic}
                name={userSelected.username}
              />
              <Box>
                <Text fontWeight="bold">{userSelected.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  Active
                </Text>
              </Box>
            </Flex>
            {/* <Flex>otherIcons</Flex> */}
          </Flex>

          <VStack
            flex={1}
            w={"100%"}
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
                      <Skeleton height="10px" mb={2} width={"100px"} />
                      <Skeleton height="8px" width="80px" />
                    </Box>
                  </Flex>
                ))
              : messages.map((msg, i) => <Message key={i} msg={msg} />)}
          </VStack>

          <Flex
            borderTop="1px solid"
            borderColor="gray.700"
            bg={colorMode === "dark" ? "gray.800" : "gray.100"}
            gap={2}
            p={2}
          >
            <Input
              placeholder="Search..."
              size="sm"
              border={"none"}
              flex={1}
              outline="none"
              focusBorderColor="transparent"
              _focus={{ boxShadow: "none" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleText();
              }}
            />
            <Flex alignItems={"center"} justifyContent={"center"} p={2} gap={4}>
              <FaRegImage cursor={"pointer"} />
              <IoSendSharp cursor={"pointer"} onClick={handleText} />
            </Flex>
          </Flex>
        </>
      ) : (
        <VStack alignItems={"center"} justifyContent={"center"} height={"100%"}>
          <IoIosMail size={40} />
          <Text>Select A User</Text>
        </VStack>
      )}
    </Flex>
  );
};

export default MessageContainer;
