import { useEffect, useRef, useState } from 'react';
import PopupWrapper from '../../component/PopupWrapper/PopupWrapper';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import './postPage.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineEllipsis, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { IoMdPaperPlane } from 'react-icons/io';
import { BiBookmark } from 'react-icons/bi';
import { CiFaceSmile } from 'react-icons/ci';
import Picker from 'emoji-picker-react';
import { times } from '../../component/func/commonFunc';
import { images } from '../../source';
import { BASE_URL, commentPost, deleteAndBackupPost, deletePost, getPostById, likePost } from '../../action/action';
import { useUser } from '../../store/useStore';
import Share from '../../component/share/Share';
import SavedAlbum from '../../component/SaveAlbum/Save';
import { useTranslation } from 'react-i18next';
function PostPage() {
    const {t} = useTranslation()
    const navigate = useNavigate();

    const ref = useRef();
    const { id } = useParams();
    const [post, setPost] = useState(undefined);
    const [value, setValue] = useState('');
    const [isLike, setIsLike] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const [isShare, setIsShare] = useState(false)
    const [isSaved,  setIsSaved] = useState(false)
    // custom
    const [isCustom, setIsCustom] = useState(false);

    // Comment 
    const [comments, setComments] = useState(post?.comments  || [])
    console.debug("comment: ", comments);
    
    const customRef = useRef();
    // GET URL
    const url = window.location.href;
    const checkURLTrash = url.includes('trash');


    // get current user
    const {currentUser} = useUser()


    useOnClickOutside(customRef, () => setIsCustom(false));
    useOnClickOutside(ref, () => {
        window.history.back();
    });
    const getPost = async () => {

        const data  = await getPostById(id)
        setPost(data);
        setComments(data.comments)
    }
    useEffect(() => {
        getPost();
        
    }, [isCustom]);
    const emojiRef = useRef();
    useOnClickOutside(emojiRef, () => {
        setShowPicker(false);
    });
    const divRef = useRef();
    const divLength = () => {
        const value = divRef.current.innerHTML;
        setValue(value);
    };
    const handleEmojiClick = (emoji) => {
        let msg = value;
        msg += emoji.emoji;
        divRef.current.innerHTML = msg;
        setValue(msg);
    };

    useEffect(() => {
        setIsLike(() => post?.likedByUsers.some((item) =>item.id === currentUser.id));
    }, [post]);

    const handleLike = (idPost) => {
        setIsLike((prev) => !prev);
        likePost(idPost);
    };
    //handle comment
    const handlePostComment = async (postId,value) => {
        console.log(value);
        
        if(value.length ===0) return;
        const data = await commentPost({postId, comment: value})
        if(data.status ===200) {
             const newComment = {
                content: value,
                createdAt: new Date().toISOString(), // tạo thời gian hiện tại
                user: {
                    id: currentUser.id,
                    username: currentUser.username,
                    avatar: currentUser.avatar,
                }
                };
            setComments(prev => [newComment, ...prev])
        }
        
    };
    const liRef = useRef();
    const handleDeletePost = async () => {
            const data  = await deleteAndBackupPost(post?.id);
        if (data.status === 200) {
            setIsCustom(false);
        }
    };
    return (
        <PopupWrapper isClose={true}>
            <div className="inner-post-page flex" ref={ref}>
                <div className="file">
                    {
                        post?.reel === true ? <video autoPlay={true} loop  src={`${BASE_URL + post?.images[0]?.imageUrl}`}/> : <img style={{transform: `scale(${post?.scaleImage})`}} src={`${BASE_URL + post?.images[0]?.imageUrl}`} alt={post?.title} />
                    }
                </div>
                <div className="detail flex flex-column ">
                    <header className="flex j-between a-center">
                        <div className="left flex">
                            <div className="img">
                                <img src={post?.user.avatar? BASE_URL + post?.user.avatar: images.noAvatar} alt="" />
                            </div>
                            <div className="information flex a-center">
                                <Link to={`/${post?.user?.id}`}>{post?.user?.username}</Link>
                            </div>
                        </div>

                        <div className="right">
                            <span className="icon" onClick={() => setIsCustom(true)}>
                                <AiOutlineEllipsis />
                            </span>
                        </div>
                    </header>
                    <div className="content-comment h-[200px] overflow-y-scroll">
                        <div className="item-comment flex a-center">
                                    <div className="avatar">
                                        {currentUser.avatar ? (
                                            <img src={BASE_URL+currentUser.avatar} alt="avatar" />
                                        ) : (
                                            <img src={images.noAvatar} alt="no-avatar" />
                                        )}
                                    </div>
                                    <div className="main">
                                        <div className="flex a-center">
                                            <Link to={`/${currentUser.id}`}>{currentUser.username}</Link>
                                            <p className="comment">{post?.title}</p>
                                        </div>
                                        {/* <div className="times">
                                            <p>{time}</p>
                                        </div> */}
                                    </div>
                                </div>
                        {
                           comments.length ===0 ? 
                            <p className='w-full h-full flex justify-center items-center text-sa'>{t("fist_comment")}</p>: 
                            
                       comments.map((item, index) => {
                            const time = times(item.createdAt, t);

                            return (
                                <div className="item-comment flex a-center" key={index}>
                                    <div className="avatar">
                                        {item?.user.avatar ? (
                                            <img src={BASE_URL+ item?.user.avatar} alt="avatar" />
                                        ) : (
                                            <img src={images.noAvatar} alt="no-avatar" />
                                        )}
                                    </div>
                                    <div className="main">
                                        <div className="flex a-center">
                                            <Link to={`/${item.user.id}`}>{item.user.username}</Link>
                                            <p className="comment">{item.content}</p>
                                        </div>
                                        <div className="times">
                                            <p>{time}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        }
                    </div>
                    <footer>
                        <div className="interaction">
                            <div className=" flex a-center j-between">
                                <div className="left">
                                    <div className='flex'>
                                        <span
                                            className="like"
                                            title={isLike ? t("dislike") : t("like")}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            {isLike ? <AiFillHeart className="red" /> : <AiOutlineHeart />}
                                        </span>
                                        <span className="comment" title={t("comment")} onClick={() => divRef.current.focus()}>
                                            <FaRegComment />
                                        </span>
                                        <span onClick={()=> setIsShare(true)} className="share" title={t("share")}>
                                            <IoMdPaperPlane />
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className="right ">
                                    <span onClick={()=>setIsSaved(true)} className="save" title={t("save")}>
                                        <BiBookmark />
                                    </span>
                                </div>
                            </div>
                            <div className="like-post-and-time">
                                <h4>{`${post?.likedByUsers?.length} ${t("person_likes")}`}</h4>
                                <p>{times(post?.createdAt, t)}</p>
                            </div>
                        </div>
                        <div className="comment-post flex a-center j-between">
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
                            {/* <div
                                className="text"
                                contentEditable={true}
                                aria-label="Thêm bình luận"
                                onInput={divLength}
                                ref={divRef}
                            ></div> */}
                            <div className='flex-1 flex'>
                                <input
                                    className='flex-1 ml-4'
                                    value={value}
                                    onChange={(e)=>setValue(e.target.value)}
                                    placeholder={t("comment_post_placeholder")}
                                />
                                    <p
                                    onClick={() => {
                                        setValue('');
                                        handlePostComment(post.id, value);
                                    }}
                                    className={value.length > 0 ? 'bold cursor-pointer' : 'blur'}>{t("comment")}</p>
                            
                            </div>
                        </div>
                    </footer>
                </div>
                {isCustom && (
                    <div className="custom">
                        <div ref={customRef}>
                            {post?.user?.id === currentUser.id ? (
                                <ul>
                                    <li className="delete" ref={liRef} onClick={() => handleDeletePost()}>
                                        {post?.delete ? t("restore") : t("delete")}
                                    </li>
                                    <li>{post?.delete ? t("turn_off_comment") : t("turn_on_comment") }</li>
                                    <li>{post?.isLike ? t("turn_off_like") :  t("turn_on_like")}</li>
                                    <li>{t("change_audience")}</li>
                                </ul>
                            ) : (
                                <ul>
                                    <li>cc</li>
                                </ul>
                            )}
                        </div>
                    </div>
                )}
                {
                    isShare && <Share postId={id} onClose={setIsShare}/>
                }
                {
                    isSaved && <SavedAlbum postId={id} onClose={setIsSaved}/>
                }
            </div>
        </PopupWrapper>
    );
}

export default PostPage;
