const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://socialsync-backend.onrender.com"
    : "";

// instead of url add vite url here later

export default API_URL;
