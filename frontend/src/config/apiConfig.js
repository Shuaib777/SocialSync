const API_URL =
  process.env.NODE_ENV === "production" ? import.meta.env.VITE_API_URL : "";

// instead of url add vite url here later

export default API_URL;
