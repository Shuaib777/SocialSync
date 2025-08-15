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
import React, { useState, useEffect, useRef } from "react";
import useApi from "../hooks/useApi";
import { useSocket } from "../context/SocketsContext";

const ChatList = ({
  setUserSelected,
  setConversationSelected,
  conversations,
  setConversations,
}) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const request = useApi();
  const { socket } = useSocket();

  // Refs for debounce & stale prevention
  const timeoutRef = useRef(null);
  const requestCounterRef = useRef(0);

  const handleChat = (convo) => {
    setUserSelected(convo.otherParticipant);
    setConversationSelected(convo);
    setSearchQuery("");
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const trimmedQuery = searchQuery.trim();

    requestCounterRef.current += 1;
    const currentRequestId = requestCounterRef.current;

    // Debounce fetch
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await request(
          `/chat/getConversations?query=${trimmedQuery}`
        );
        // Prevent stale overwrite
        if (currentRequestId === requestCounterRef.current) {
          setConversations(data || []);
        }
      } catch (err) {
        if (currentRequestId === requestCounterRef.current) {
          setConversations([]);
        }
      } finally {
        if (currentRequestId === requestCounterRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  return (
    <Box flex="30%" borderRight="1px solid" borderColor="gray.700" h="100%">
      <Flex px={4} align="center">
        <Text fontWeight="bold" fontSize="lg">
          Chats
        </Text>
      </Flex>

      <Box p={4}>
        <Input
          placeholder="Search..."
          size="sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
          : conversations.map((convo, i) => (
              <Flex
                key={convo._id || `new-${i}`}
                p={3}
                align="center"
                gap={3}
                _hover={{
                  bg: colorMode === "dark" ? "gray.800" : "gray.200",
                  cursor: "pointer",
                }}
                onClick={() => handleChat(convo)}
              >
                <Avatar
                  w="40px"
                  h="40px"
                  src={convo?.otherParticipant?.profilePic}
                  name={convo?.otherParticipant?.username}
                />
                <Box>
                  <Text fontWeight="bold">
                    {convo?.otherParticipant?.username}
                  </Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {convo?.lastMessage?.text.substring(0, 20)}
                  </Text>
                </Box>
              </Flex>
            ))}
      </VStack>
    </Box>
  );
};

export default ChatList;
