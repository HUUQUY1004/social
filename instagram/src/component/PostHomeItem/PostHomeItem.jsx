import './posthomeitem.scss';
import { useEffect, useRef, useState } from 'react';
import { images } from '../../source';
import { AiOutlineEllipsis, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { IoMdPaperPlane } from 'react-icons/io';
import { BiBookmark } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { CiFaceSmile } from 'react-icons/ci';
import Picker from 'emoji-picker-react';
import onClickOutSide from '../../hook/useOnClickOutSide.js';
import { BASE_URL, commentPost, likePost } from '../../action/action.js';
function PostHomeItem({ currentUser, item, time }) {
    const [showPicker, setShowPicker] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [value, setValue] = useState('');

    const emojiRef = useRef();
    useEffect(() => {
        setIsLike(() => item?.likedByUsers.includes(currentUser.id));
    }, [item]);
    const handleLike = (idPost) => {
        likePost(idPost);
    };
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const handleEmojiClick = (emoji) => {
        let msg = value;
        msg += emoji.emoji;
        setValue(msg);
    };
    // onClickOutSide
    onClickOutSide(emojiRef, () => {
        setShowPicker(false);
    });
    const handlePostComment = async (postId) => {
       const data = await commentPost({postId, comment: value})
        console.log("data", data);
        setValue('');
    };
    return (
        <div className="post-home-item">
            <div className="post-header flex a-center j-between">
                <Link className="post-user flex a-center" to={`/${item.user.id}`}>
                    <div className="img">
                        {currentUser?.avatar ? (
                            <img
                                src={BASE_URL +currentUser?.avatar}
                                alt={currentUser?.username}
                                style={{ transform: `scale(${item.scaleImage})` }}
                            />
                        ) : (
                            <img src={images.noAvatar} alt="noAvatar" />
                        )}
                    </div>
                    <div className="information flex a-center">
                        <h3 className="username">{item?.user.username}</h3>
                        <span>{time}</span>
                    </div>
                </Link>
                <div className="post-icon">
                    <span>
                        <AiOutlineEllipsis />
                    </span>
                </div>
            </div>
            <div className="post-content">
                <div className="post-file">
                    <img src={BASE_URL+ item.images[0].imageUrl} alt="no" />
                </div>
                <div className="interaction flex a-center j-between ">
                    <div className="left ">
                        {item.isShowLike && (
                            <span
                                className="like"
                                title={isLike ? 'Bỏ thích' : 'Thích'}
                                onClick={() => {
                                    handleLike(item._id);
                                    setIsLike(!isLike);
                                }}
                            >
                                {isLike ? <AiFillHeart className="red" /> : <AiOutlineHeart />}
                            </span>
                        )}
                        <span className="comment" title="Bình luận">
                            <FaRegComment />
                        </span>
                        <span className="share" title="Chia sẻ">
                            <IoMdPaperPlane />
                        </span>
                    </div>
                    <div className="right ">
                        <span className="save" title="Lưu">
                            <BiBookmark />
                        </span>
                    </div>
                </div>
                {item.isShowLike && <div>{item.like.length > 0 ? `${item.like.length} người thích` : ''}</div>}
                <div className="description flex a-center">
                    <Link to={`'/${currentUser?.username}`}>{currentUser?.username}</Link>
                    <p className>{item.title}</p>
                </div>
                {item.comment.length > 0 && (
                    <Link to={`/p/${item?.id}`} className="see-comment">
                        Xem {item.comment.length} bình luận
                    </Link>
                )}
                {item.isComment && (
                    <form className="flex a-center j-between" method="POST" onSubmit={(e) => e.preventDefault()}>
                        <div className="comment">
                            <input
                                type="text"
                                placeholder="Thêm bình luận"
                                autoCorrect=""
                                value={value}
                                onChange={(e) => handleChange(e)}
                            ></input>
                            {value.length > 0 && (
                                <span className="post" onClick={() => handlePostComment(item.id)}>
                                    Đăng
                                </span>
                            )}
                        </div>
                        <div className="icon">
                            <span style={{ cursor: 'pointer' }} onClick={() => setShowPicker(!showPicker)}>
                                <CiFaceSmile />
                                {showPicker && (
                                    <div className="emoji" ref={emojiRef}>
                                        <Picker onEmojiClick={handleEmojiClick} previewConfig={false} />
                                    </div>
                                )}
                            </span>
                        </div>
                    </form>
                )}
            </div>
            <div className="separator"></div>
        </div>
    );
}

export default PostHomeItem;
