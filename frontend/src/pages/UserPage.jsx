import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import API_URL from "../config/apiConfig.js";
import useCustomToast from "../hooks/useCustomToast";
import { Flex, Spinner } from "@chakra-ui/react";
import useApi from "../hooks/useApi.jsx";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.jsx";
import postsAtom from "../atoms/postsAtom.jsx";

const UserPage = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useCustomToast();
  const request = useApi();
  const [profileUserPosts, setProfileUserPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      setProfileUser(null);
      setProfileUserPosts([]);

      try {
        const data = await request(`/users/profile/${username}`);
        if (!data) return;
        setProfileUser(data);
      } catch (error) {
        showToast("Error", "User not found", "error");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [username]);

  useEffect(() => {
    const getUserPosts = async () => {
      if (!profileUser) return;

      setIsPostsLoading(true);
      const postsData = await request(`/posts/getUserPosts/${profileUser._id}`);
      if (postsData) {
        setProfileUserPosts(postsData);
      }
      setIsPostsLoading(false);
    };

    getUserPosts();
  }, [profileUser]);

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
      {isPostsLoading ? (
        <Flex alignItems={"center"} justifyContent={"center"} w={"full"}>
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        <>
          {profileUserPosts.length === 0 &&
            (currentUser._id === profileUser._id ? (
              <h1>Post Something to see your posts here</h1>
            ) : (
              <h1>User Does Not have recent Posts</h1>
            ))}
          {profileUserPosts?.map((post) => (
            <UserPost
              key={post._id}
              isDelete={currentUser._id === profileUser._id}
              post={post}
            />
          ))}
        </>
      )}
    </>
  );
};

export default UserPage;
