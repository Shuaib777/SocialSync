import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useApi from "../hooks/useApi";
import Actions from "./Actions";
import postsAtom from "../atoms/postsAtom";

const PostActions = ({ post, setSinglePost }) => {
  const { _id: currentUserId } = useRecoilValue(userAtom);
  const request = useApi();

  const [replying, setReplying] = useState(false);
  const [liking, setLiking] = useState(false);

  const [likesLength, setLikesLength] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(currentUserId));
  const [repliesCount, setRepliesCount] = useState(post.replies.length);
  const setPosts = useSetRecoilState(postsAtom);

  const handleLikeUnlike = async () => {
    setLiking(true);
    const data = await request(
      `/posts/likeUnlike/${post._id}`,
      "PATCH",
      null,
      false,
      true
    );
    if (!data) return;
    setLiking(false);
    setLikesLength(data.likesLength);
    setLiked(data.isLiked);
  };

  const handleReply = async (replyText) => {
    setReplying(true);
    const data = await request(
      `/posts/reply/${post._id}`,
      "PATCH",
      {
        text: replyText,
      },
      false,
      true
    );
    setReplying(false);
    if (!data) return;

    setPosts((posts) =>
      posts.map((prevPost) =>
        prevPost._id === post._id ? data.newPost : prevPost
      )
    );

    if (setSinglePost) setSinglePost(data.newPost);
    setRepliesCount((prev) => prev + 1);
  };

  return (
    <Flex flexDir={"column"}>
      <Flex my={1}>
        <Actions
          liking={liking}
          liked={liked}
          handleLikeUnlike={handleLikeUnlike}
          replying={replying}
          handleReply={handleReply}
        />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {repliesCount} replies
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
