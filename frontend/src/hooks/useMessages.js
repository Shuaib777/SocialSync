import { useEffect, useRef, useState } from "react";
import useApi from "./useApi";

export const useMessages = (userSelected) => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const firstLoad = useRef(); // when first load the scroll should be auto else smooth
  const request = useApi();

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

  return { messages, setMessages, messagesLoading, firstLoad };
};
