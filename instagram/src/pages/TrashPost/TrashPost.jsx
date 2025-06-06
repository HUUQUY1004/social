
import { useEffect, useState } from 'react';
import PostList from '../../component/PostList/PostList';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { getTrash } from '../../action/action';
import { useTranslation } from 'react-i18next';
function TrashPost() {
    const {t} = useTranslation()
    const [posts, setPosts] = useState([]);
    const [isCustom, setIsCustom] = useState(false)
    const getTrashByUser = async () => {
        const data = await getTrash();
        if(data.status){
            alert(data.message)
        }
        setPosts(data);
    };
    useEffect(() => {
        getTrashByUser();
    }, []);
    return (
        <div className="trash-post__wrapper p-8 pb-10">
            <div className='flex justify-between'>
                        <Link to={'/profile'} className='flex gap-3 items-center'>
                            <FontAwesomeIcon icon={faAngleLeft}/>
                            <span className='font-semibold'>{t("trash_can")}</span>
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
