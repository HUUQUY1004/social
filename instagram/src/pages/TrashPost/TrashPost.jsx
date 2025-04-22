
import { useEffect, useState } from 'react';
import PostList from '../../component/PostList/PostList';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
function TrashPost() {
    const [posts, setPosts] = useState([]);
    const [isCustom, setIsCustom] = useState(false)
    const getTrashByUser = async () => {
        // const { data } = await axios.get(`http://localhost:5000/post/get-trash-post/${userLocal._id}`);
        // setPosts(data.data);
    };
    useEffect(() => {
        getTrashByUser();
    }, []);
    return (
        <div className="trash-post__wrapper p-8 pb-10">
            <div className='flex justify-between'>
                        <Link to={'/profile'} className='flex gap-3 items-center'>
                            <FontAwesomeIcon icon={faAngleLeft}/>
                            <span className='font-semibold'>Thùng rác</span>
                        </Link>
                        <div className='p-2' onClick={()=> setIsCustom(true)}>
                            <FontAwesomeIcon icon={faEllipsisVertical}  />
                        </div>
            </div>
            <div className="post-list">
                {
                    posts.length === 0 ? <div className='text-center lg:h-48'>Không có bài viết nào</div>: <PostList data={posts} type={'trash'} />
                }
            </div>
        </div>
    );
}

export default TrashPost;
