import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaRegImage } from "react-icons/fa6";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";
import useApi from "../hooks/useApi";
import useCustomToast from "../hooks/useCustomToast";
import imageCompression from "browser-image-compression";
import { useSetRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImage, imgUrl, setImgUrl } = usePreviewImage();
  const [textValue, setTextValue] = useState("");
  const imageRef = useRef();
  const CHARACTERS_LIMIT = 150;
  const request = useApi();
  const showToast = useCustomToast();
  const [isLoading, setIsLoading] = useState(false);
  const setPosts = useSetRecoilState(postsAtom);

  const btnSize = useBreakpointValue({ base: "lg", md: "md" });
  const btnBottom = useBreakpointValue({ base: 6, md: 10 });
  const btnRight = useBreakpointValue({ base: 6, md: 10 });
  const iconOnly = useBreakpointValue({ base: true, md: false });
  const iconSize = useBreakpointValue({ base: 5, md: 4 });

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setTextValue(newValue.slice(0, CHARACTERS_LIMIT));
  };

  const handleCreatePost = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("text", textValue);

      if (imageRef.current?.files[0]) {
        const compressedFile = await imageCompression(
          imageRef.current.files[0],
          { maxSizeMB: 0.3, maxWidthOrHeight: 800, useWebWorker: true }
        );

        formData.append("postImage", compressedFile);
      }

      const data = await request("/posts/createPost", "POST", formData, true);
      if (!data) return;
      setPosts((posts) => [data.post, ...posts]);
      showToast("Success", "Post created Successfully", "success");
      onClose();
    } catch (error) {
      showToast("Error", "Post not created", "error");
    } finally {
      setTextValue("");
      setImgUrl("");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Post Button */}
      <Button
        position="fixed"
        bottom={btnBottom}
        right={btnRight}
        size={btnSize}
        leftIcon={!iconOnly && <AddIcon w={4} h={4} />}
        onClick={onOpen}
        borderRadius="full"
        zIndex={1000}
        p={iconOnly ? 4 : 5}
      >
        {!iconOnly && "Post"}
        {iconOnly && <AddIcon w={iconSize} h={iconSize} />}
      </Button>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        motionPreset="scale"
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" borderRadius="xl" p={[4, 6]} mx={2}>
          <ModalHeader color="white" fontSize={["lg", "2xl"]}>
            Create Post
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody mb={5}>
            <FormControl>
              <Textarea
                placeholder="Content goes here ..."
                onChange={handleTextChange}
                value={textValue}
                bg="gray.800"
                color="white"
                borderRadius="md"
                resize="none"
                borderColor={"gray.500"}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.400"
                mt={1}
                textAlign="right"
              >
                {textValue.length}/{CHARACTERS_LIMIT}
              </Text>

              <Input ref={imageRef} type="file" hidden onChange={handleImage} />
              <FaRegImage
                style={{ cursor: "pointer", marginTop: "8px" }}
                size={20}
                onClick={() => imageRef.current.click()}
                color="white"
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} position="relative" w="full" justify="center">
                <Image
                  src={imgUrl}
                  borderRadius="lg"
                  maxH="300px"
                  objectFit="cover"
                  boxShadow="lg"
                />
                <CloseButton
                  position="absolute"
                  top={2}
                  right={2}
                  bg="gray.600"
                  onClick={() => {
                    imageRef.current.value = "";
                    setImgUrl("");
                  }}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleCreatePost}
              isLoading={isLoading}
              borderRadius="md"
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
