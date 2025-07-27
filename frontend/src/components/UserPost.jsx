import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useApi from "../hooks/useApi";
import PostActions from "./PostActions";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
} from "@chakra-ui/react";
import useCustomToast from "../hooks/useCustomToast";
import { useSetRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import getRelativeTime from "../utils/date";

const UserPost = ({ post, isDelete }) => {
  if (!post) return;
  const user = post.postedBy;
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const showToast = useCustomToast();
  const [deleting, setDeleting] = useState(false);
  const request = useApi();
  const setPosts = useSetRecoilState(postsAtom);

  const copyPostUrl = () => {
    navigator.clipboard
      .writeText(`/${user?.username}/post/${post._id}`)
      .then(() => {
        showToast("Copied", "Post Link Copied", "success");
      });
  };

  const deletePost = async () => {
    if (deleting) return;
    setDeleting(true);
    const data = request(`/posts/deletePost/${post._id}`, "DELETE");
    setDeleting(false);
    if (!data) return;

    showToast("Deleted", "Post Deleted successfully", "success");
    setPosts((prev) => prev.filter((prevPost) => prevPost._id !== post._id));
  };

  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user?.username}
            src={user?.profilePic}
            cursor={"pointer"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>

          {post.replies.length === 0 && <span>🥱</span>}
          <Box position={"relative"} w={"full"}>
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={14}
                color={"gray.light"}
                width={30}
                textAlign={"right"}
              >
                {getRelativeTime(post.createdAt)}
              </Text>
              <Box
                className="icon-container"
                cursor={"pointer"}
                onClick={(e) => e.preventDefault()}
              >
                <Menu>
                  <MenuButton>
                    <BsThreeDots size={24} />
                  </MenuButton>
                  <Portal>
                    <MenuList bg={"gray.dark"}>
                      <MenuItem
                        bg={"gray.dark"}
                        _hover={{ bg: "gray.light" }}
                        onClick={copyPostUrl}
                      >
                        Copy Post Link
                      </MenuItem>
                      {isDelete && (
                        <MenuItem
                          bg={"gray.dark"}
                          _hover={{ bg: "gray.light" }}
                          onClick={deletePost}
                        >
                          Delete Post
                        </MenuItem>
                      )}
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>

          {post.img && (
            <Box position="relative" overflow="hidden" borderRadius={6}>
              <Skeleton isLoaded={loaded}>
                <Image
                  src={post.img}
                  alt="Post Image"
                  loading="lazy"
                  w="full"
                  onLoad={() => setLoaded(true)}
                />
              </Skeleton>
            </Box>
          )}

          <PostActions post={post} />
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
