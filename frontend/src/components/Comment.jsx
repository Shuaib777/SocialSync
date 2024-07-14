import { Avatar, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({
  comment,
  commenterImage,
  commenterName,
  commenterLikes,
}) => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex w={"full"} gap={4}>
        <Box>
          <Avatar size={"sm"} src={commenterImage} name={commenterName} />
        </Box>
        <VStack alignItems={"start"} flex={1} gap={1}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {commenterName}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"}>2d</Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{comment}</Text>
          <Actions liked={liked} setLiked={setLiked} />
          <Text>{liked ? commenterLikes + 1 : commenterLikes} likes</Text>
        </VStack>
      </Flex>
      <Divider></Divider>
    </>
  );
};

export default Comment;
