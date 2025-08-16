import { Avatar, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ msg }) => {
  const { colorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  const isOwnMessage = user._id === msg.sender._id;

  // Safer seen check — ensure seenBy exists and sender's id comparison is consistent
  const isSeen = Array.isArray(msg.seenBy)
    ? msg.seenBy.some((sb) => sb.user?.toString() !== msg.sender._id.toString())
    : false;

  if (isOwnMessage) {
    // Outgoing message
    return (
      <Flex
        alignSelf="flex-end"
        maxW="70%"
        gap={2}
        flexDirection="row-reverse"
        mb={3}
      >
        <Avatar
          w="40px"
          h="40px"
          cursor="pointer"
          src={user.profilePic}
          name={user.username}
        />
        <Box>
          <Text
            bg={colorMode === "dark" ? "blue.600" : "blue.400"}
            color="white"
            px={3}
            py={2}
            borderRadius="md"
          >
            {msg.text}
          </Text>
          <Flex justify="flex-start" align="center" gap={1} mt={1}>
            <BsCheck2All
              size={14}
              color={isSeen ? "#00d4aa" : "#718096"} // teal if seen, gray if not
            />
            <Text fontSize="xs" color="gray.500">
              {isSeen ? "Seen" : "Sent"}
            </Text>
          </Flex>
        </Box>
      </Flex>
    );
  } else {
    // Incoming message
    return (
      <Flex alignSelf="flex-start" color="inherit" maxW="70%" gap={2} mb={3}>
        <Avatar
          w="40px"
          h="40px"
          cursor="pointer"
          src={msg.sender.profilePic}
          name={msg.sender.username}
        />
        <Text
          bg={colorMode === "dark" ? "gray.700" : "gray.200"}
          color={colorMode === "dark" ? "white" : "black"}
          px={3}
          py={2}
          borderRadius="md"
        >
          {msg.text}
        </Text>
      </Flex>
    );
  }
};

export default Message;
