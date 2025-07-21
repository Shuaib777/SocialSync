import { Avatar, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import useApi from "../hooks/useApi";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// i will add reply to the replies later
const Comment = ({ reply, postId }) => {
  if (!reply) return;
  const { _id: currentUserId } = useRecoilValue(userAtom);
  const request = useApi();

  const [loading, setLoading] = useState(false);
  const [likesLength, setLikesLength] = useState(reply.likes.length);
  const [liked, setLiked] = useState(reply.likes.includes(currentUserId));

  const handleLikeUnlike = async () => {
    setLoading(true);
    const data = await request(
      `/posts/likeUnlikeReply/${postId}/${reply._id}`,
      "PATCH"
    );
    if (!data) return;
    setLoading(false);
    setLikesLength(data.likesLength);
    setLiked(data.liked);
  };

  const handleReply = () => {};

  return (
    <>
      <Flex w={"full"} gap={4}>
        <Box>
          <Avatar
            size={"sm"}
            src={reply.userProfilePic}
            name={reply.username}
          />
        </Box>
        <VStack alignItems={"start"} flex={1} gap={1}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"}>2d</Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{reply.text}</Text>
          <Actions
            loading={loading}
            liked={liked}
            handleLikeUnlike={handleLikeUnlike}
            handleReply={handleReply}
          />
          <Text>{likesLength} likes</Text>
        </VStack>
      </Flex>
      <Divider></Divider>
    </>
  );
};

export default Comment;
