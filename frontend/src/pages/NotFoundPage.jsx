import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt="20">
      <Text fontSize="3xl" mb="4">
        404 - Page Not Found
      </Text>
      <Text mb="6">The page you are looking for does not exist.</Text>
      <Button colorScheme="blue" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
