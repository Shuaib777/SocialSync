import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const LoginCard = ({ setIsSignup }) => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://socialsync-backend.onrender.com"
      : "";

  console.log(API_URL);

  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (data.error) {
        toast({
          title: "Login Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        return;
      }

      localStorage.setItem("user-posts", JSON.stringify(data));
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={8} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{ base: "full", md: "400px" }}
        >
          <Stack spacing={4}>
            <FormControl id="lastName" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("blue.700", "blue.800")}
                color={"white"}
                _hover={useColorModeValue("blue.800", "blue.900")}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Create an Account{" "}
                <Link
                  onClick={() => setIsSignup((prev) => !prev)}
                  color={"blue.400"}
                >
                  SignUp
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginCard;
