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
import React, { useState, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa6";
import Message from "./Message";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: { username: "John Doe", _id: 1 },
          text: "Hey, how are you?",
        },
        {
          id: 1,
          sender: { username: "John Doe", _id: user._id },
          text: "I'm good! How about you?",
        },
        {
          id: 3,
          sender: { username: "John Doe", _id: 1 },
          text: "All good here 👍",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <Flex flex="60%" direction="column" h="100%">
      <Flex align="center" bg="gray.900" p={4} justifyContent={"space-between"}>
        <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
          <Avatar w="40px" h="40px" cursor={"pointer"} />
          <Box>
            <Text fontWeight="bold">John DOe</Text>
            <Text fontSize="sm" color="gray.500">
              Active
            </Text>
          </Box>
        </Flex>
        {/* <Flex>otherIcons</Flex> */}
      </Flex>

      <VStack flex={1} w={"100%"} overflowY="auto" p={4} spacing={6}>
        {loading
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
          : messages.map((msg) => <Message key={msg._id} msg={msg} />)}
      </VStack>

      {/* Message Input */}
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
        />
        <Flex></Flex>
        <Flex alignItems={"center"} justifyContent={"center"} p={2} gap={4}>
          <FaRegImage cursor={"pointer"} />
          <IoSendSharp cursor={"pointer"} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MessageContainer;
