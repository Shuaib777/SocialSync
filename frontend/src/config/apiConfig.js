const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://socialsync-backend.onrender.com"
    : "";

export default API_URL;
