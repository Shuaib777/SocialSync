import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

export const useSocketMessages = ({
  socket,
  userSelected,
  conversationSelected,
  setMessages,
  setConversations,
  setUserSelectedStatus,
}) => {
  const user = useRecoilValue(userAtom);
  const [pendingSeenEvents, setPendingSeenEvents] = useState([]);

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

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (messageIds.includes(msg._id)) {
            wasMessageFound = true;
            const seenByArray = msg.seenBy || [];
            if (seenByArray?.some((seen) => seen.user === seenBy)) return msg;
            return {
              ...msg,
              seenBy: [...seenByArray, { user: seenBy, seenAt: new Date() }],
            };
          }
          return msg;
        });

        return updatedMessages;
      });

      if (!wasMessageFound) {
        setPendingSeenEvents((prevEvents) => [
          ...prevEvents,
          { messageId: messageIds?.[0], seenBy },
        ]);
      }
    };

    socket.on("onlineUserStatus", statusHandler);
    socket.on("userOnline", onlineHandler);
    socket.on("userOffline", offlineHandler);
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("onlineUserStatus", statusHandler);
      socket.off("userOnline", onlineHandler);
      socket.off("userOffline", offlineHandler);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, userSelected?._id, conversationSelected?._id]);

  return { pendingSeenEvents, setPendingSeenEvents };
};
