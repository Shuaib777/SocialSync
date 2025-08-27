import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("postToken", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "",
  });

  return token;
};

export default generateToken;
