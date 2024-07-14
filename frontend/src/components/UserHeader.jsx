import {
  Avatar,
  Box,
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
import React from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {
  const toast = useToast();
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        description: "Profile Link Copied",
        status: "success",
        duration: 700,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Mark Zuckerberg
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>markzukerberg</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={2}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name="Mark"
            src="/user1.png"
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>Cofounder, executive chairman and CEO of Meta platform.</Text>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex
          gap={2}
          alignItems={"center"}
          color={"gray.light"}
          fontSize={"sm"}
        >
          <Text>3.2k Followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link>instagram.com</Link>
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
