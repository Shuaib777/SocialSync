import { Button, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import UserPost from "../components/UserPost";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
  const request = useApi();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await request("/posts/feeds");
        if (!data) return;
        setPosts(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Flex alignItems={"center"} justifyContent={"center"} w={"full"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  return (
    <>
      {posts.length === 0 && (
        <h1>Follow Some Users to show them on your feed</h1>
      )}
      {posts?.map((post) => {
        if (user && post.postedBy._id === user._id) return;
        return <UserPost key={post._id} post={post} />;
      })}
    </>
  );
};

export default HomePage;
