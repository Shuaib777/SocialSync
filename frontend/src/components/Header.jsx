import React from "react";
import {
  Flex,
  Box,
  Image,
  Avatar,
  useColorMode,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Center,
  CloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { IoHome, IoChatbubbleEllipsesOutline, IoSearch } from "react-icons/io5";
import userAtom from "../atoms/userAtom";
import Search from "./Search";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      mt={[4, 6]}
      mb={[8, 12]}
      px={[4, 0]}
      w="100%"
      gap={4}
    >
      {/* Left icons */}
      <Flex alignItems="center" gap={6}>
        {user && (
          <Link to={"/"}>
            <IoHome size={24} />
          </Link>
        )}
        {user && (
          <Link to={"/chat"}>
            <IoChatbubbleEllipsesOutline size={24} />
          </Link>
        )}
      </Flex>

      {/* Logo */}
      <Box display={["inline-block", "block"]}>
        <Image
          cursor="pointer"
          alt="logo"
          src={colorMode === "dark" ? "/dark-logo.svg" : "/light-logo.svg"}
          onClick={toggleColorMode}
          w={20}
        />
      </Box>

      {/* Right icons */}
      <Flex alignItems="center" gap={5}>
        {user && (
          <IconButton
            icon={<IoSearch />}
            aria-label="Search"
            onClick={onOpen}
            rounded="full"
            size="md"
            variant="outline"
            _hover={{ bg: "gray.700" }}
          />
        )}

        {/* Profile avatar */}
        {user && (
          <Link to={`/${user?.username}`}>
            <Avatar
              size="sm"
              name={user?.username}
              src={user?.profilePic}
              cursor="pointer"
            />
          </Link>
        )}
      </Flex>

      {/* Search modal */}
      {user && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent
            bg="gray.900"
            borderRadius="md"
            maxW={["100%", "520px"]}
            h={["100vh", "70vh"]}
            mx="auto"
          >
            <ModalHeader color="white" pb={2}>
              <Flex justify="space-between" align="center">
                Search Users
                <CloseButton
                  aria-label="Close"
                  onClick={onClose}
                  variant="ghost"
                  color="white"
                />
              </Flex>
            </ModalHeader>
            <ModalBody>
              <Center>
                <Box w="100%" maxW="620px">
                  <Search onClose={onClose} />
                </Box>
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default Header;
