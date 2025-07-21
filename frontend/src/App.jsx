import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import ProfilePage from "./pages/ProfilePage";
import CreatePost from "./components/CreatePost";

const App = () => {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/update"
          element={user ? <ProfilePage /> : <Navigate to="/auth" />}
        />

        <Route
          path="/:username"
          element={user ? <UserPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/:username/post/:pid"
          element={user ? <PostPage /> : <Navigate to="/auth" />}
        />
      </Routes>

      {user ? <LogoutButton /> : <LoginButton />}
      {user && <CreatePost></CreatePost>}
    </Container>
  );
};

export default App;

// social sync remaining work
// 	home page feed
// 	like and reply
// 	userPage
// 	chat app
