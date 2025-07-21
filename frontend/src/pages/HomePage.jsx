import { Button, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import UserPost from "../components/UserPost";

const HomePage = () => {
  const request = useApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {posts?.map((post) => (
        <UserPost key={post._id} post={post} />
      ))}
    </>
  );
};

export default HomePage;
