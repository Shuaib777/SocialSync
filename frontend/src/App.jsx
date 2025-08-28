import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ProfilePage from "./pages/ProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { useState } from "react";

const App = () => {
  const user = useRecoilValue(userAtom);
  const [chatSelected, setChatSelected] = useState(false);

  return (
    <Container position={"relative"} maxW="620px">
      {!chatSelected && <Header />}
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
        <Route
          path="/chat"
          element={
            user ? (
              <ChatPage setChatSelected={setChatSelected} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {user && !chatSelected && <CreatePost></CreatePost>}
    </Container>
  );
};

export default App;
