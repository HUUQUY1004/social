import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostList from '../../component/PostList/PostList';
function TrashPost() {
    const [posts, setPosts] = useState([]);
    const userLocal = JSON.parse(localStorage.getItem('instagram-user'));
    const getTrashByUser = async () => {
        // const { data } = await axios.get(`http://localhost:5000/post/get-trash-post/${userLocal._id}`);
        // setPosts(data.data);
    };
    useEffect(() => {
        getTrashByUser();
    }, []);
    return (
        <div className="trash-post__wrapper">
            <h1 className="flex j-center a-center">Trash</h1>
            <div className="post-list">
                <PostList data={posts} type={'trash'} />
            </div>
        </div>
    );
}

export default TrashPost;
