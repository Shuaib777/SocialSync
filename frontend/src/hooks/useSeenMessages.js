import { useEffect } from "react";
import useApi from "../hooks/useApi";

export const useSeenMessages = (conversationSelected, setConversations) => {
  const request = useApi();

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
};
