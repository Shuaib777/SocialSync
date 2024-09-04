import React, { useState } from "react";
import SignupCard from "../components/SignUpCard";
import LoginCard from "../components/LoginCard";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  return isSignup ? (
    <SignupCard setIsSignup={setIsSignup} />
  ) : (
    <LoginCard setIsSignup={setIsSignup} />
  );
};

export default AuthPage;
