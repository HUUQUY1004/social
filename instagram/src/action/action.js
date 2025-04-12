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

export const getNumberOfFriends = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/friend/quantity`, config);
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return 0;
  }
};

export const getListFriend = async (value) => {
  let url;
  if (!value) {
    url = `${BASE_URL}/api/friend/`;
  } else {
    url = `${BASE_URL}/api/friend/list/${value}`;
  }
  try {
    console.log("url: " + url);

    const { data } = await axios.get(url, config);
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

export const sendMessage = async (body) => {
  try {
    const formData = new FormData();
    formData.append("formUser", body.formUser);
    formData.append("toUserId", body.toUserId);
    formData.append("content", body.content);
    formData.append("image", body.image);
    formData.append("video", body.video);
    const { data } = await axios.post(
      `${BASE_URL}/api/messages/send`,
      formData,
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const getConversation = async (toUserId) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/messages/conversation/${toUserId}`,
      config
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

// post
//  1. create post
export const createPost = async (value) => {
  const formData = new FormData();
  formData.append("title", value.title);
  formData.append("isComment", value.isComment);
  formData.append("isShowLike", value.isShowLike);
  formData.append("postVisibility", value.postVisibility);
  formData.append("scaleImage", value.scaleImage);
  formData.append("images", value.images);
  const { data } = await axios.post(
    `${BASE_URL}/api/post/create`,
    formData,
    config
  );
  return data;
};

// getPost for userId
export const getPostForUserId = async (userId) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${userId}`, config);
  return data;
};

export const getPostById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/api/post?id=${id}`, config);
  console.log(data);

  return data;
};
export const likePost = async (id) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/post/likePost`,
    {
      postId: id,
    },
    config
  );
  return data;
};
export const commentPost = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/post/comment`,
    value,
    config
  );
  return data;
};
export const getUserById = async (userId) => {
  const { data } = await axios.get(`${BASE_URL}/api/user/${userId}`, config);
  return data;
};
export const sharePost = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/messages/share`,
    value,
    config
  );
  return data;
};
