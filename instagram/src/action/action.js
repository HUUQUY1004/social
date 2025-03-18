import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const token = localStorage.getItem("access_token");

export const login = async (email, password) => {
  const { data } = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });
  return data;
};

export const getMyProfile = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(
    `${BASE_URL}/api/profile/my-profile`,
    config
  );

  return data;
};
