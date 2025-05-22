import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import API_URL from "../config/apiConfig.js";
import useCustomToast from "../hooks/useCustomToast";
import { Center, Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useCustomToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setProfileUser(data);
      } catch (error) {
        showToast("Error", "User not found", "error");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (isLoading)
    return (
      <Flex alignItems={"center"} justifyContent={"center"} w={"full"}>
        <Spinner size={"xl"} />
      </Flex>
    );

  if (!profileUser) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <UserHeader profileUser={profileUser} setProfileUser={setProfileUser} />
      <UserPost
        userName={"Mark Zuckerberg"}
        userImage={"/user1.png"}
        postImg={"/post1.png"}
        postTitle={"Let's talk about threads"}
        likes={89}
        replies={76}
      />
      <UserPost
        userName={"Rollin "}
        userImage={"/user2.jpg"}
        postImg={"/post2.png"}
        postTitle={"Let's talk."}
        likes={89}
        replies={76}
      />
      <UserPost
        userName={"Jeff"}
        userImage={"/user3.jpg"}
        postImg={"/post3.png"}
        postTitle={"What about threads"}
        likes={89}
        replies={76}
      />
      <UserPost
        userName={"Andy"}
        userImage={"/user4.jpg"}
        postTitle={"My thread"}
        likes={89}
        replies={76}
      />
    </>
  );
};

export default UserPage;
