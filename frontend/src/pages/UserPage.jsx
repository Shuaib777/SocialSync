import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import API_URL from "../config/apiConfig.js";
import useCustomToast from "../hooks/useCustomToast";

const UserPage = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
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
        showToast("Error", error.error, "error");
      }
    };

    getUser();
  }, [username, showToast]);

  if (!profileUser) return null;

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
