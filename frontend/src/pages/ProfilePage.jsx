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
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";

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

  const handleUpdateUser = async () => {
    const res = await fetch("/api/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
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

      return;
    }

    console.log(data);
  };
  return (
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
              <Avatar size="xl" src={inputs.profilePic}></Avatar>
            </Center>
            <Center w="full">
              <Button w="full">Change Picture</Button>
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
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
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
  );
}
