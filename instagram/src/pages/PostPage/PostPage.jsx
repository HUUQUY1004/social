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
import axios from 'axios';
import { times } from '../../component/func/commonFunc';
import { images } from '../../source';
import { BASE_URL, commentPost, deletePost, getPostById, likePost } from '../../action/action';
import { useUser } from '../../store/useStore';
import Share from '../../component/share/Share';
import SavedAlbum from '../../component/SaveAlbum/Save';
function PostPage() {
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
        if (checkURLTrash) {
            console.log("run 1");
            
            const { data } = await axios.get(`http://localhost:5000/post/trash/${id}`);
            console.log(data);
            setPost(data.post);
        } else {
            console.log("run 2");
            
            const data  = await getPostById(id)
            setPost(data);
        }
    };
    useEffect(() => {
        getPost();
    }, []);
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
        const data = await commentPost({postId, comment: value})
        console.log("data", data);
        
    };
    const liRef = useRef();
    const handleDeletePost = async () => {
        if (liRef.current.innerHTML === 'Xóa') {
            console.log('delete');
            const data  = await deletePost(post?.id);
            if (data.status === 200) {
                setIsCustom(false);
            }
        }
        if (liRef.current.innerHTML === 'Khôi phục') {
            const { data } = await axios.patch(`http://localhost:5000/post/restored/${post?._id}`);
            if (data.status) {
                setIsCustom(false);
            }
        }
        window.location.reload();
    };
    return (
        <PopupWrapper isClose={true}>
            <div className="inner-post-page flex" ref={ref}>
                <div className="file">
                    <img style={{transform: `scale(${post?.scaleImage})`}} src={`${BASE_URL + post?.images[0]?.imageUrl}`} alt={post?.title} />
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
                    <div className="content-comment">
                        {
                            post?.comments.length ===0 ? 
                            <p className='w-full h-full flex justify-center items-center text-sa'>Hãy là người đầu tiên bình luận</p>: 
                            
                       post?.comments.map((item, index) => {
                            const time = times(item.createdAt);

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
                                            title={isLike ? 'Bỏ thích' : 'Thích'}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            {isLike ? <AiFillHeart className="red" /> : <AiOutlineHeart />}
                                        </span>
                                        <span className="comment" title="Bình luận" onClick={() => divRef.current.focus()}>
                                            <FaRegComment />
                                        </span>
                                        <span onClick={()=> setIsShare(true)} className="share" title="Chia sẻ">
                                            <IoMdPaperPlane />
                                        </span>
                                    </div>
                                    
                                </div>
                                <div className="right ">
                                    <span onClick={()=>setIsSaved(true)} className="save" title="Lưu">
                                        <BiBookmark />
                                    </span>
                                </div>
                            </div>
                            <div className="like-post-and-time">
                                <h4>{`${post?.likedByUsers?.length} người thích`}</h4>
                                <p>{times(post?.createdAt)}</p>
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
                            <div
                                className="text"
                                contentEditable={true}
                                aria-label="Thêm bình luận"
                                onInput={divLength}
                                ref={divRef}
                            ></div>
                            <div>
                                <p
                                    className={value.length > 0 ? 'bold' : 'blur'}
                                    style={value.length > 0 ? { cursor: 'pointer' } : { cursor: 'text' }}
                                    onClick={() => {
                                        setValue('');
                                        handlePostComment(post.id, value);
                                    }}
                                >
                                    Đăng
                                </p>
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
                                        {post?.delete ? 'Khôi phục' : 'Xóa'}
                                    </li>
                                    <li>{post?.delete ? 'Tắt tính năng bình luận' : 'Bật tính năng bình luận'}</li>
                                    <li>{post?.isLike ? 'Ẩn lượt thích' : 'Bật lượt thích'}</li>
                                    <li>Thay đổi đối tượng xem bài viết</li>
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
