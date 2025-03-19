import axios from "axios";

export const BASE_URL = "http://localhost:5000";

export const token = localStorage.getItem("access_token");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
export const login = async (email, password) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMyProfile = async () => {
  const { data } = await axios.get(
    `${BASE_URL}/api/profile/my-profile`,
    config
  );
  console.log("profile: ", data);

  return data;
};
export const changeDescription = async (description) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/profile/update-description`,
    {
      description,
    },
    config
  );
  return data;
};
export const changeAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  formData.append("title", "Avatar");
  const { data } = await axios.post(
    `${BASE_URL}/api/profile/update-avatar`,
    formData,
    config
  );
  return data;
};
