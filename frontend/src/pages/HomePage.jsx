import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Spinner, Flex } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useApi from "../hooks/useApi";
import UserPost from "../components/UserPost";

const HomePage = () => {
  const request = useApi();
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  const [posts, setPosts] = useRecoilState(postsAtom);
  const [recommendedPosts, setRecommendedPosts] = useState([]);

  const [hasPost, setHasPost] = useState(false);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await request("/posts/feeds");
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      const data = await request("/posts/recommend");
      if (data) setRecommendedPosts(data);
      setLoadingRecommended(false);
    };

    if (!loading && user) {
      fetchRecommendedPosts();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" w="full">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      {!hasPost && <h1>Follow some users to see posts on your feed</h1>}

      {posts?.map((post) => {
        if (user && post.postedBy._id === user._id) return null;
        if (!hasPost) setHasPost(true);
        return <UserPost key={post._id} post={post} />;
      })}

      {loadingRecommended && (
        <Flex mt={5} alignItems="center" justifyContent="center" w="full">
          <BeatLoader size={10} color="white" />
        </Flex>
      )}

      {!loadingRecommended && recommendedPosts.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Recommended Posts
          </h2>
          {recommendedPosts.map((post) => (
            <UserPost key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
