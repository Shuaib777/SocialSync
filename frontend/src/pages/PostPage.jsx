import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";

const PostPage = ({ postImg = true, likes = 200 }) => {
  const [liked, setLiked] = useState(false);
  return (
    <VStack gap={4} alignItems={"start"} mb={12}>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={4} alignItems={"center"}>
          <Avatar src="/user1.png" size={"md"} name="Mark Zuckerberg"></Avatar>
          <Flex gap={1} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              markzuckerberg
            </Text>
            <Image src="/verified.png" w={4} h={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontStyle={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text textAlign={"start"}>Lets talk about threads</Text>
      {postImg && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={"/post1.png"} w={"full"} />
        </Box>
      )}

      <Actions liked={liked} setLiked={setLiked}></Actions>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {liked ? likes + 1 : likes} likes
        </Text>
      </Flex>

      <Divider></Divider>
      <Flex w={"full"} alignItems={"center"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text>Get that app </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider></Divider>

      <Comment
        comment="Really liked the post"
        commenterImage="/user2.jpg"
        commenterName="Guerilla"
        commenterLikes={200}
      />
      <Comment
        comment="What is the post about"
        commenterImage="/user3.jpg"
        commenterName="Robertson"
        commenterLikes={10}
      />
      <Comment
        comment="Then Let's talk"
        commenterImage="/user4.jpg"
        commenterName="Marsh"
        commenterLikes={100}
      />
    </VStack>
  );
};

export default PostPage;
