import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useApi from "../hooks/useApi";
import Actions from "./Actions";

const PostActions = ({ post }) => {
  const { _id: currentUserId } = useRecoilValue(userAtom);
  const request = useApi();

  const [liking, setLiking] = useState(false);
  const [likesLength, setLikesLength] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(currentUserId));

  const handleLikeUnlike = async () => {
    setLiking(true);
    const data = await request(`/posts/likeUnlike/${post._id}`, "PATCH");
    if (!data) return;
    setLiking(false);
    setLikesLength(data.likesLength);
    setLiked(data.isLiked);
  };

  return (
    <Flex flexDir={"column"}>
      <Flex my={1}>
        <Actions
          liking={liking}
          liked={liked}
          handleLikeUnlike={handleLikeUnlike}
        />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {likesLength} likes
        </Text>
      </Flex>
    </Flex>
  );
};

export default PostActions;
