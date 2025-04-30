"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";

export default function ProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    bio: user.bio,
    email: user.email,
    name: user.name,
    profilePic: user.profilePic,
    password: "",
  });
  const toast = useToast();
  const fileRef = useRef(null);
  const { imgUrl, handleImage } = usePreviewImage();
  const [loading, setLoading] = useState(false);

  const handleUpdateUser = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", inputs.email);
    formData.append("name", inputs.name);
    formData.append("bio", inputs.bio);
    formData.append("password", inputs.password);
    if (fileRef.current?.files[0]) {
      formData.append("profilePic", fileRef.current.files[0]);
    }

    const res = await fetch("/api/users/update", {
      method: "PATCH",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      toast({
        title: "Update Error",
        description: data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    localStorage.setItem("user-posts", JSON.stringify(data));
    setUser(data);
  };

  return (
    <>
      {loading && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0, 0, 0, 0.4)"
          zIndex="9999"
          align="center"
          justify="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}

      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userPic">
            <FormLabel>User Pic</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic}></Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Picture
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImage}
                ></Input>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="Name">
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>
          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              onClick={handleUpdateUser}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
