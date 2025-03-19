import { useEffect, useState } from 'react';
import './postHome.scss';
import { getCurrentUserByID } from '../func/commonFunc';
import PostHomeItem from '../PostHomeItem/PostHomeItem';
import { times } from '../func/commonFunc';

function PostHome({ postList }) {
    const [users, setUsers] = useState([]);
    const uniqueUserIds = Array.from(new Set(postList?.map((item) => item.idUser))); // Tạo một mảng duy nhất các id người dùng từ postList
    const uniqueUsers = uniqueUserIds?.map((idUser) => getCurrentUserByID(idUser)); // Tạo một mảng duy nhất các người dùng từ id người dùng
    const userIdFromLike = postList?.map((item) => item.like);
    const uniqueIdUserFromLike = userIdFromLike?.map((item) => item.toString());
    // console.log(uniqueIdUserFromLike);
    const convert = async () => {
        const user = await Promise.all(uniqueUsers);
        setUsers(user);
    };
    useEffect(() => {
        convert();
    }, []);

    const userLocal = JSON.parse(localStorage.getItem('instagram-user'));

    return (
        <div className="post-home">
            {postList?.map((item, index) => {
                const currentUser = users.find((user) => user._id === item.idUser); // Tìm người dùng hiện tại dựa trên userId trong mảng duy nhất uniqueUsers\
                const time = times(item.createdAt);

                return (
                    <div key={index} className="post-home-item-wrapper">
                        <PostHomeItem currentUser={currentUser} item={item} time={time} />
                    </div>
                );
            })}
        </div>
    );
}

export default PostHome;
