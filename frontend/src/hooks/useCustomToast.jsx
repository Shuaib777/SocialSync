import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );

  return showToast;
};

export default useCustomToast;
