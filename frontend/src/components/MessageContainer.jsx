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
import { useSocket } from "../context/SocketsContext";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const MessageContainer = ({
  userSelected,
  conversationSelected,
  setConversations,
}) => {
  const { colorMode } = useColorMode();
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const request = useApi();
  const messagesContainerRef = useRef();
  const firstLoad = useRef(); // when first load the scroll should be auto else smooth
  const { socket } = useSocket();
  const user = useRecoilValue(userAtom);
  const [userSelectedStatus, setUserSelectedStatus] = useState(false);
  const [pendingSeenEvents, setPendingSeenEvents] = useState([]);

  useEffect(() => {
    setMessages([]);
    const getMessages = async () => {
      if (!userSelected) return;
      setMessagesLoading(true);
      const data = await request(
        `/chat/getMessages/${userSelected._id}`,
        "GET",
        null,
        false,
        true
      );
      setMessagesLoading(false);

      if (!data) return;
      setMessages(data);
      firstLoad.current = true;
    };
    getMessages();
  }, [userSelected]);

  // Mark messages as seen when conversation opens
  useEffect(() => {
    const markAsSeen = async () => {
      if (!conversationSelected?._id) return;

      try {
        await request(
          `/chat/markMessagesAsSeen/${conversationSelected._id}`,
          "POST",
          null,
          false,
          true
        );

        // Update local conversations to reset unread count
        setConversations((prev) =>
          prev.map((convo) =>
            convo._id === conversationSelected._id
              ? { ...convo, unreadCount: 0 }
              : convo
          )
        );
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    };

    markAsSeen();
  }, [conversationSelected?._id]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: firstLoad.current ? "auto" : "smooth",
    });

    if (firstLoad.current) firstLoad.current = false;
  }, [messages]);

  useEffect(() => {
    if (!socket || !userSelected?._id) return;

    // Ask server if this user is online
    socket.emit("isUserOnline", userSelected._id);

    const statusHandler = ({ _id, isOnline }) => {
      if (_id === userSelected._id) {
        setUserSelectedStatus(isOnline);
      }
    };

    const onlineHandler = ({ _id }) => {
      if (_id === userSelected._id) setUserSelectedStatus(true);
    };

    const offlineHandler = ({ _id }) => {
      if (_id === userSelected._id) setUserSelectedStatus(false);
    };

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.sender._id === userSelected._id ||
        user?._id === userSelected._id
      ) {
        setMessages((prev) => [...prev, newMessage]);

        // If I'm the receiver and have this convo open → mark as seen immediately
        if (newMessage.sender._id !== user?._id) {
          socket.emit("messagesSeenServer", {
            conversationId: newMessage.conversationId,
            senderId: newMessage.sender._id,
            seenBy: user._id,
            messageIds: [newMessage._id],
          });
        }
      }

      setConversations((prev) => {
        const updated = prev.map((convo) => {
          if (convo._id === newMessage.conversationId) {
            // If this is the currently selected conversation, don't increment unread count
            const isCurrentConversation =
              convo._id === conversationSelected?._id;
            const currentUnreadCount = isCurrentConversation
              ? 0
              : convo.unreadCount || 0;

            return {
              ...convo,
              lastMessage: { ...convo.lastMessage, text: newMessage.text },
              unreadCount:
                newMessage.sender._id === user?._id
                  ? 0
                  : currentUnreadCount + (isCurrentConversation ? 0 : 1),
            };
          }
          return convo;
        });

        const convoToMove = updated.find(
          (c) => c._id === newMessage.conversationId
        );
        return [
          convoToMove,
          ...updated.filter((c) => c._id !== newMessage.conversationId),
        ];
      });
    };

    // Handle messages seen by other user
    const handleMessagesSeen = ({ conversationId, seenBy, messageIds }) => {
      if (conversationId !== conversationSelected?._id) return;

      let wasMessageFound = false;

      // update the message directly
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (messageIds.includes(msg._id)) {
            wasMessageFound = true; // Mark that we found it
            const seenByArray = msg.seenBy || [];
            if (seenByArray?.some((seen) => seen.user === seenBy)) return msg; // Already seen
            return {
              ...msg,
              seenBy: [...seenByArray, { user: seenBy, seenAt: new Date() }],
            };
          }
          return msg;
        });

        return updatedMessages;
      });

      // If we couldn't find the message, add the event to our collection
      // this runs when there might be conflict
      // this can happen when the sender sends the message and the receiver
      // whose current selected user is that sender give the notification
      // to the server that it has seen the message then server immediately
      // sends this notification to the sender client again but the problem
      // here is that new message is not even mounted on the dom so
      // that message will never be there so i have to collect this messages
      // and update after the messages have been mounter
      if (!wasMessageFound) {
        setPendingSeenEvents((prevEvents) => [
          ...prevEvents,
          { messageId: messageIds?.[0], seenBy },
        ]);
      }
    };

    socket.on("onlineUserStatus", statusHandler); // this is to check if that user is online
    socket.on("userOnline", onlineHandler); // this triggers when the user comes online
    socket.on("userOffline", offlineHandler); // this triggers when user goes offline
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen); // handler for seen messages

    return () => {
      socket.off("onlineUserStatus", statusHandler);
      socket.off("userOnline", onlineHandler);
      socket.off("userOffline", offlineHandler);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, userSelected?._id, conversationSelected?._id]);

  useEffect(() => {
    // Do nothing if our collection is empty
    if (pendingSeenEvents.length === 0) return;

    let stillPendingEvents = [...pendingSeenEvents];
    let wasStateUpdated = false;

    const updatedMessages = messages.map((msg) => {
      // Find a pending event that matches this message
      const eventForThisMsg = stillPendingEvents.find(
        (event) => event.messageId === msg._id
      );

      if (eventForThisMsg) {
        wasStateUpdated = true;
        // Remove the event from our pending list since we're about to process it
        stillPendingEvents = stillPendingEvents.filter(
          (event) => event.messageId !== msg._id
        );

        // "Plug in" the seen status
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

    // If we successfully plugged in any seen statuses, update the state
    if (wasStateUpdated) {
      setMessages(updatedMessages);
      setPendingSeenEvents(stillPendingEvents); // Update the collection
    }
  }, [messages, pendingSeenEvents]); // This logic runs whenever messages or pending events change

  const handleText = async () => {
    if (!userSelected) return;

    const data = await request(
      "/chat/createMessage",
      "POST",
      {
        text,
        recipientId: userSelected._id,
      },
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
              unreadCount: 0, // Reset unread count since user is sending message
            }
          : convo
      );

      // updated conversation to the top
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
                  {userSelectedStatus ? "Active" : "Inactive"}
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
