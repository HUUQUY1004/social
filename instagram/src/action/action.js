import axios from "axios";

export const BASE_URL = "http://localhost:5000";

export const token = localStorage.getItem("access_token");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
export const login = async (email, password) => {
  console.log(email, password);

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
export const searchUser = async (value) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/user/search/${value}`,
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const getSuggestion = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/suggestion`,
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const getInvitation = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/friend/getInvitation`,
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const addFriend = async (receiverId) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/friend/add/${receiverId}`,
      {},
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const acceptFriend = async (requestId) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/friend/accept/${requestId}`,
      {},
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const rejectFriend = async (requestId) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/friend/reject/${requestId}`,
      {},
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const getNotify = async (value) => {
  const page = value === null ? "" : value;
  try {
    const { data } = await axios.get(`${BASE_URL}/api/notify/`, config);
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
