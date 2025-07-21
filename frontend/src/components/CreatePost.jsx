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
  useDisclosure,
} from "@chakra-ui/react";
import { FaRegImage } from "react-icons/fa6";
import React, { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";
import useApi from "../hooks/useApi";
import useCustomToast from "../hooks/useCustomToast";
import imageCompression from "browser-image-compression";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImage, imgUrl, setImgUrl } = usePreviewImage();
  const [textValue, setTextValue] = useState("");
  const imageRef = useRef();
  const CHARACTERS_LIMIT = 50;
  const request = useApi();
  const showToast = useCustomToast();
  const [isLoading, setIsLoading] = useState(false);

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
          {
            maxSizeMB: 1,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
          }
        );
        formData.append("postImage", compressedFile);
      }

      // if (imageRef.current?.files[0])
      //   formData.append("postImage", imageRef.current.files[0]);

      const data = await request("/posts/createPost", "POST", formData, true);
      if (!data) return;

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
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={5}>
            <FormControl>
              <Textarea
                placeholder="Content goes here ..."
                onChange={handleTextChange}
                value={textValue}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                color={"gray"}
                mt={1}
                textAlign={"right"}
              >
                {textValue.length}/{CHARACTERS_LIMIT}
              </Text>

              <Input ref={imageRef} type="file" hidden onChange={handleImage} />
              <FaRegImage
                style={{ cursor: "pointer" }}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} position={"relative"} w={"full"}>
                <Image src={imgUrl} />
                <CloseButton
                  position={"absolute"}
                  top={2}
                  right={2}
                  bg={"gray.dark"}
                  onClick={() => setImgUrl("")}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleCreatePost}
              isLoading={isLoading}
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
