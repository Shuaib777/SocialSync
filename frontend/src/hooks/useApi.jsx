import API_URL from "../config/apiConfig.js";
import useCustomToast from "./useCustomToast.jsx";

const useApi = () => {
  const showToast = useCustomToast();
  const request = async (
    endpoint,
    method = "GET",
    body = null,
    isAuth = false
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/${endpoint}`, {
        method,
        credentials: isAuth ? "include" : "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await res.json();

      if (data.error) {
        showToast(data.error, "Error", "error");
        return null;
      }

      return data;
    } catch (error) {
      showToast(error.message || "Error", "Error", "error");
      return null;
    }
  };

  return request;
};

export default useApi;
