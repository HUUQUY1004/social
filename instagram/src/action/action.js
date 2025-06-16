import axios from "axios";
export const BASE_URL = "http://localhost:5000";

const handleError = (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      window.location.href = "/login";
    } else {
      return {
        status: error.response.status,
        message: error.response.data?.message || "Unknown error",
      };
    }
  } else {
    return { message: "No response from server" };
  }
};

export const getToken = () => localStorage.getItem("access_token");

export const getConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
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
    if (error.response && error.response.status === 403) {
      window.location.href = "/login";
      return;
    }
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { jwt: null, message: "No response from server" };
  }
};
export const register = async (value) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, value);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getMyProfile = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/profile/my-profile`,
      getConfig()
    );

    return data;
  } catch (error) {
    console.log("debug:", error);
    
    if (error.response) {
      if (error.response.status === 403 || error.response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('access_token');
        window.location.href = "/login";
        return null;
      }
    }
    
    return handleError(error);
  }
};
export const changeDescription = async (description) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/profile/update-description`,
    {
      description,
    },
    getConfig()
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
    getConfig()
  );
  return data;
};
export const searchUser = async (value) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/user/search/${value}`,
      getConfig()
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
      getConfig()
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
      getConfig()
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
      getConfig()
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
      getConfig()
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
      getConfig()
    );
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
export const deleteFriend = async (userId) => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/api/friend/${userId}`,
      getConfig()
    );
    return data;
  } catch (error) {
    // handleError(error);
    console.log(error);
  }
};
export const getNotify = async (value) => {
  const page = value === null ? "" : value;
  try {
    const { data } = await axios.get(`${BASE_URL}/api/notify/`, getConfig());
    return data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

export const getNumberOfFriends = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/friend/quantity`, getConfig());
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

    const { data } = await axios.get(url, getConfig());
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
      getConfig()
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
      getConfig()
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
  formData.append("video", value.video);
  const { data } = await axios.post(
    `${BASE_URL}/api/post/create`,
    formData,
    getConfig()
  );
  return data;
};

// getPost for userId
export const getPostForUserId = async (userId) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${userId}`, getConfig());
  return data;
};

export const getPostById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/post?id=${id}`, getConfig());
    console.log(data);

    return data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.message,
    };
  }
};
export const likePost = async (id) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/post/likePost`,
    {
      postId: id,
    },
    getConfig()
  );
  return data;
};
export const commentPost = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/post/comment`,
    value,
    getConfig()
  );
  return data;
};
export const getUserById = async (userId) => {
  const { data } = await axios.get(`${BASE_URL}/api/user/${userId}`, getConfig());
  return data;
};
export const sharePost = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/messages/share`,
    value,
    getConfig()
  );
  return data;
};

// gen Token

export const generateTokenStringee = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/stringee/token`, getConfig());
  return data;
};

// delete post
export const deleteAndBackupPost = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/api/post/${id}`, getConfig());
  console.log(data);

  return data;
};
export const getQuantityPost = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/post/quantity`, getConfig());
  return data;
};

export const getPostHome = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/post/for-home`, getConfig());
  return data;
};

export const createAlbum = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/album/create`,
    value,
    getConfig()
  );
  return data;
};
export const getAllAlbum = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/album/all`, getConfig());
  return data;
};

export const addPostToAlbum = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/album/saved`,
    value,
    getConfig()
  );
  return data;
};

export const getAlbumById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/api/album/${id}`, getConfig());
  return data;
};
export const deleteAlbum = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/api/album/${id}`, getConfig());
  return data;
};

export const getTrash = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/post/trash`, getConfig());
    return data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.message,
    };
  }
};
export const getReels = async (page) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/post/reels?page=${page}`,
      getConfig()
    );
    return data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.message,
    };
  }
};
export const findUserByEmail = async (email) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/find-email`, {
      email,
    });
    return data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.message,
    };
  }
};
export const verifyOTP = async (value) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/verify-otp`, value);
    return data;
  } catch (error) {
    return {
      status: error.response.status,
      message: error.response.message,
    };
  }
};
export const changePassword = async (value) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/change-password`,
      value,
      getConfig()
    );
    console.log(data);

    return data;
  } catch (error) {
    handleError(error);
  }
};
export const changeStatusComment = async (postId) => {
  const { data } = await axios.patch(
    `${BASE_URL}/api/post/change-status-comment`,
    { postId },
    getConfig()
  );

  return data;
};
export const changeStatusLike = async (postId) => {
  const { data } = await axios.patch(
    `${BASE_URL}/api/post/change-status-like`,
    { postId },
    getConfig()
  );

  return data;
};
export const changePasswordUser = async (value) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/user/change-password`,
    value,
    getConfig()
  );

  return data;
};
export const sendImageToBLIP = async (base64Image) => {
  const { data } = await axios.post(
    "http://localhost:8080/generate-caption",
    {
      image_base64: base64Image,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
