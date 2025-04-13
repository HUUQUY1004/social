import axios from "axios";
export const following = async (currentUserId, _id) => {
  const { data } = await axios.post(
    `http://localhost:5000/api/user/suggested/${currentUserId}`,
    {
      idUserFlow: _id,
    }
  );
  console.log(data);
};
export const unFollowing = async (currentUserId, _id) => {
  const { data } = await axios.post(
    `http://localhost:5000/api/user/unflow/${currentUserId}`,
    {
      idUserFlow: _id,
    }
  );
  console.log(data);
};
// export const getCurrentUserByID = async (id) => {
//   const res = await axios.get(
//     `http://localhost:5000/api/user/get-user-by-id/${id}`
//   );
//   return res.data.user;
// };
// export const likePost = async (idPost, idUser) => {
//   axios.post(`http://localhost:5000/post/like/${idPost}`, {
//     id: idUser,
//   });
// };
export const dislikePost = async (idPost, idUser) => {
  axios.post(`http://localhost:5000/post/dislike/${idPost}`, {
    id: idUser,
  });
};
export const times = (createAtItem) => {
  const createdAt = new Date(createAtItem);
  const currentDate = new Date();
  const timeElapsedInSeconds = Math.floor((currentDate - createdAt) / 1000); //1S = 1000 MILI
  if (timeElapsedInSeconds < 60) {
    return `${timeElapsedInSeconds} giây trước`;
  } else if (timeElapsedInSeconds < 3600) {
    const minutes = Math.floor(timeElapsedInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (timeElapsedInSeconds < 86400) {
    const hours = Math.floor(timeElapsedInSeconds / 3600);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(timeElapsedInSeconds / 86400);
    return `${days} ngày trước`;
  }
};
