import { useState } from "react";
import useCustomToast from "../hooks/useCustomToast";

const usePreviewImage = () => {
  const showToast = useCustomToast();
  const [imgUrl, setImgUrl] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Wrong file", "Please select image", "error");
      setImgUrl(null);
    }
  };

  return { handleImage, imgUrl, setImgUrl };
};

export default usePreviewImage;
