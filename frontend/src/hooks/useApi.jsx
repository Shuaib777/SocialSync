import API_URL from "../config/apiConfig.js";
import useCustomToast from "./useCustomToast.jsx";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const useApi = () => {
  const showToast = useCustomToast();
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const request = async (
    endpoint,
    method = "GET",
    body = null,
    isFormData = false,
    isAuth = false
  ) => {
    try {
      const headers = {};

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${API_URL}/api${endpoint}`, {
        method,
        credentials: isAuth ? "include" : "same-origin",
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : null,
      });

      if (res.status === 401) {
        setUser(null);
        localStorage.removeItem("user-posts");
        showToast("Session expired. Please log in again.", "Error", "error");
        navigate("/auth");
        return null;
      }

      const data = await res.json();

      if (data.error) {
        showToast(data.error, "Error", "error");
        return null;
      }

      return data;
    } catch (error) {
      showToast("Network error. Please try again.", "Error", "error");
      return null;
    }
  };

  return request;
};

export default useApi;
