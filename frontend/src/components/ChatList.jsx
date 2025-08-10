import {
  Box,
  Flex,
  Text,
  Input,
  VStack,
  Skeleton,
  SkeletonCircle,
  useColorMode,
  Avatar,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const ChatList = () => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setConversations([
        { id: 1, name: "John Doe", lastMessage: "Hey, how are you?" },
        { id: 2, name: "Jane Smith", lastMessage: "Let's meet tomorrow!" },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <Box flex="30%" borderRight="1px solid" borderColor="gray.700" h="100%">
      <Flex px={4} align="center">
        <Text fontWeight="bold" fontSize="lg">
          Chats
        </Text>
      </Flex>

      <Box p={4}>
        <Input placeholder="Search..." size="sm" />
      </Box>

      <VStack align="stretch" overflowY="auto" spacing={0}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Flex key={i} p={3} align="center" gap={3}>
                <SkeletonCircle size="10" />
                <Box flex="1">
                  <Skeleton height="10px" mb={2} />
                  <Skeleton height="8px" width="80%" />
                </Box>
              </Flex>
            ))
          : conversations.map((c) => (
              <Flex
                key={c.id}
                p={3}
                align="center"
                gap={3}
                _hover={{
                  bg: colorMode === "dark" ? "gray.800" : "gray.200",
                  cursor: "pointer",
                }}
              >
                <Avatar w="40px" h="40px" />
                <Box>
                  <Text fontWeight="bold">{c.name}</Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {c.lastMessage}
                  </Text>
                </Box>
              </Flex>
            ))}
      </VStack>
    </Box>
  );
};

export default ChatList;
