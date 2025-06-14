import './posthomeitem.scss';
import { useContext, useEffect, useRef, useState } from 'react';
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
import SavedAlbum from '../SaveAlbum/Save.jsx';
import Share from '../share/Share.jsx';
import { ReelContext } from '../../context/ReelContext.js';
import { useTranslation } from 'react-i18next';

function PostHomeItem({ currentUser, item, time,  }) {
    const {t} = useTranslation()
    const [showPicker, setShowPicker] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [value, setValue] = useState('');
    const [isSaved, setIsSaved] = useState(false)
    const [isShare, setIsShare] = useState(false)

    const className = useContext(ReelContext)
    const emojiRef = useRef();
    const videoRef = useRef()
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

    //  check user is this post ?
    useEffect(() => {
    const video = videoRef.current;
    const handleUserInteraction = () => {
        observer.observe(video);
        document.removeEventListener('click', handleUserInteraction);
    };

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                video?.play().catch((e) => console.log("Autoplay failed", e));
            } else {
                video?.pause();
            }
        },
        { threshold: 0.6 }
    );

    if (video) {
        document.addEventListener('click', handleUserInteraction);
    }

    return () => {
        if (video) observer.unobserve(video);
        document.removeEventListener('click', handleUserInteraction);
    };
}, []);



    return (
        <div className="post-home-item">
            <div className="post-header flex a-center j-between">
                <Link className="post-user flex a-center" to={`/${item.user.id}`}>
                    <div className="img">
                        {item.user?.avatar ? (
                            <img
                                src={BASE_URL +item.user?.avatar}
                                alt={item.user?.username}
                                className='object-cover'
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
                <div className={`${className} post-file`}>
                   {
                    item?.reel ? 
                    <video ref={videoRef} className='h-full' src={BASE_URL+ item.images[0].imageUrl}  loop controls />
                     :
                       <img src={BASE_URL+ item.images[0].imageUrl} alt="no" />
                   }
                </div>
                <div className="interaction flex a-center j-between ">
                    <div className="left flex gap-2 items-center">
                        {item.showLike && (
                            <span
                                className="like"
                                title={isLike ? t("dislike") : t("like")}
                                onClick={() => {
                                    handleLike(item.id);
                                    setIsLike(!isLike);
                                }}
                            >
                                {isLike ? <AiFillHeart className="red" /> : <AiOutlineHeart />}
                            </span>
                        )}
                        {
                            item.comment && (
                            <Link to={`/p/${item.id}`}>
                                <span className="comment" title={t("comment")}>
                                    <FaRegComment />
                                </span>
                            </Link>
                            )
                        }
                        <span className="share" title={t("share")} onClick={()=>setIsShare(true)}>
                            <IoMdPaperPlane />
                        </span>
                    </div>
                    <div className="right ">
                        <span className="save" title={t("save")} onClick={()=>setIsSaved(true)}>
                            <BiBookmark />
                        </span>
                    </div>
                </div>
                {item?.showLike && <div>{item?.likedByUsers.length > 0 ? `${item.likedByUsers.length} ${t("person_likes")}` : ''}</div>}
                <div className="description flex a-center">
                    <Link to={`/${item?.user.id}`}>{item?.user.username}</Link>
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
            {
                isSaved && <SavedAlbum postId={item.id} onClose={setIsSaved}/>
            }
            {
                isShare && <Share postId={item.id} onClose={setIsShare}/>
            }
        </div>
    );
}

export default PostHomeItem;
