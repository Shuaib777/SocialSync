import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useCustomToast from "../hooks/useCustomToast";
import useApi from "../hooks/useApi";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const UserHeader = ({ profileUser, setProfileUser }) => {
  const showToast = useCustomToast();
  const apiRequest = useApi();
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const [following, setFollowing] = useState(
    profileUser.followers.includes(currentUser._id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Copied", "Profile Link Copied", "success");
    });
  };

  const handleFollowUnfollow = async () => {
    try {
      if (!currentUser) {
        showToast(
          "Login/Signup",
          "Login/Signup to follow/Unfollow user",
          "Erro"
        );
        return;
      }
      setIsLoading(true);
      const data = await apiRequest(
        `users/followUnfollow/${profileUser._id}`,
        "POST"
      );

      if (!data) return;

      if (following) {
        setProfileUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== currentUser._id),
        }));
        setCurrentUser((prev) => ({
          ...prev,
          following: prev.following.filter((id) => id !== profileUser._id),
        }));
        setFollowing(false);
      } else {
        setProfileUser((prev) => ({
          ...prev,
          followers: [...prev.followers, currentUser._id],
        }));
        setCurrentUser((prev) => ({
          ...prev,
          following: [...prev.following, profileUser._id],
        }));
        setFollowing(true);
      }
    } catch (error) {
      showToast(error.error, "Error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {profileUser.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{profileUser.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={profileUser.profilePic ? profileUser.name : ""}
            src={
              profileUser.profilePic
                ? profileUser.profilePic
                : "https://bit.ly/broken-link"
            }
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>{profileUser.bio}</Text>
      {currentUser?._id === profileUser._id ? (
        <Flex gap={2}>
          <Link as={RouterLink} to="/update">
            <Button>Update Profile</Button>
          </Link>
          <LogoutButton />
        </Flex>
      ) : (
        <Button onClick={handleFollowUnfollow} isLoading={isLoading}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex
          gap={2}
          alignItems={"center"}
          color={"gray.light"}
          fontSize={"sm"}
        >
          <Text>{profileUser.followers.length} Followers</Text>
          {/* <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link>instagram.com</Link> */}
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <Box className="icon-container" cursor={"pointer"}>
            <BsInstagram size={24} />
          </Box>
          <Box className="icon-container" cursor={"pointer"}>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem
                    bg={"gray.dark"}
                    _hover={{ bg: "gray.light" }}
                    onClick={copyURL}
                  >
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"} alignItems={"center"} borderBottom={"1px solid gray"}>
        <Flex
          pb={3}
          flex={1}
          justifyContent={"center"}
          cursor={"pointer"}
          borderBottom={"1px solid white"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          pb={3}
          flex={1}
          justifyContent={"center"}
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
