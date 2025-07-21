import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";

const PostPage = ({ postImg = true, likes = 200 }) => {
  const { pid } = useParams();
  const [liked, setLiked] = useState(false);
  const request = useApi();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    setLoading(true);
    const getPostDetails = async () => {
      const data = await request(`/posts/getPosts/${pid}`);
      if (!data) return;
      setPost(data);
      setUser(data.postedBy);
      setLoading(false);
    };
    getPostDetails();
  }, []);

  if (loading) {
    return (
      <Flex alignItems={"center"} justifyContent={"center"} w={"full"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // console.log(post);

  return (
    <VStack gap={4} alignItems={"start"} mb={12}>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={4} alignItems={"center"}>
          <Avatar
            src={user?.profilePic}
            size={"md"}
            name={user?.username}
          ></Avatar>
          <Flex gap={1} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontStyle={"sm"} color={"gray.light"}>
            {user.createdAt.substring(0, 8)}
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text textAlign={"start"}>{post.text}</Text>
      {postImg && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}

      <Actions liked={liked} setLiked={setLiked}></Actions>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {liked ? post.likes.length + 1 : post.likes.length} likes
        </Text>
      </Flex>

      <Divider></Divider>
      <Flex w={"full"} alignItems={"center"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          {/* <Text fontSize={"2xl"}>👋</Text> */}
          <Text>Replies </Text>
        </Flex>
        {/* <Button>Sort Replies</Button> */}
      </Flex>
      <Divider></Divider>

      {post.replies.map((reply) => {
        return <Comment key={reply._id} reply={reply} postId={post._id} />;
      })}
    </VStack>
  );
};

export default PostPage;
