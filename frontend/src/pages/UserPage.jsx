import React from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
