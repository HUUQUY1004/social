import { useEffect, useState } from 'react';
import { BiHeart } from 'react-icons/bi';
import { FaRegComments } from 'react-icons/fa';
import './postItem.scss';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../action/action';
function PostItem({ data, type }) {
    const [showLike, setShowLike] = useState(false);
    useEffect(() => {
        if (data?.like?.length > 0) {
            setShowLike(true);
        }
    }, [showLike]);
    return (
        <Link
            to={type ? `/p/${type}/${data.id}` : `/p/${data.id}`}
            key={data?._id}
            className="post-item relative"
            style={{
                ...(data.reel === false && {
                  backgroundImage: `url(${BASE_URL + data.images[0].imageUrl.replace(/\\/g, '/')})`
                })
              }}
        >
            {data.reel === true && (
                <video
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                src={`${BASE_URL + data.images[0].imageUrl.replace(/\\/g, '/')}`}
                autoPlay
                loop
                muted
                playsInline
                />
            )}
            <div className="post-item-content flex j-center a-center">
                {showLike && (
                    <div className="like flex">
                        <span className="post-item-icon">
                            <BiHeart />
                        </span>
                        <span>{data?.like.length}</span>
                    </div>
                )}
                <div className="comment flex">
                    <span className="post-item-icon">
                        <FaRegComments />
                    </span>
                    <span>{data?.comment.length}</span>
                </div>
            </div>
        </Link>
    );
}

export default PostItem;
