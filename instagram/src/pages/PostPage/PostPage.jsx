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
import { dislikePost, getCurrentUserByID, likePost, times } from '../../component/func/commonFunc';
import { images } from '../../source';
function PostPage() {
    const navigate = useNavigate();

    const ref = useRef();
    const { id } = useParams();
    const [post, setPost] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [value, setValue] = useState('');
    const [isFlow, setIsFlow] = useState(true);
    const [isLike, setIsLike] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const userLocal = JSON.parse(localStorage.getItem('instagram-user'));
    // custom
    const [isCustom, setIsCustom] = useState(false);
    const customRef = useRef();
    // GET URL
    const url = window.location.href;
    const checkURLTrash = url.includes('trash');
    useOnClickOutside(customRef, () => setIsCustom(false));
    useOnClickOutside(ref, () => {
        // const searchParams = new URLSearchParams(window.location.pathname); ncc
        // const currentURL = new URL(window.location.href);
        // const refeshPathname = currentURL.pathname.replace(currentURL.pathname, '');
        // window.history.replaceState({}, '', currentURL.href);
        window.history.back();
    });
    const getPostById = async () => {
        if (checkURLTrash) {
            const { data } = await axios.get(`http://localhost:5000/post/trash/${id}`);
            console.log(data);
            setPost(data.post);
        } else {
            const { data } = await axios.get(`http://localhost:5000/post/${id}`);
            setPost(data.post);
        }
    };
    const getUser = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/user/get-user-by-id/${post?.idUser}`);
        setUser(data.user);
    };

    useEffect(() => {
        getPostById();
    }, []);
    useEffect(() => {
        getUser();
    }, [post]);
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
        setIsLike(() => post?.like.includes(userLocal._id));
    }, [post]);
    // 1 mảng chứa idUser của người dùng cmt
    const uniqueUserIds = Array.from(new Set(post?.comment.map((item) => item.idUser)));
    const uniqueUsers = uniqueUserIds?.map((idUser) => getCurrentUserByID(idUser)); // Tạo một mảng duy nhất các người dùng từ id người dùng
    const [users, setUsers] = useState([]);
    const convert = async () => {
        const user = await Promise.all(uniqueUsers);
        setUsers(user);
    };
    useEffect(() => {
        convert();
    }, [post]);
    // handle like
    const handleLike = (idPost) => {
        setIsLike((prev) => !prev);
        if (isLike) {
            dislikePost(idPost, userLocal._id);
        } else {
            likePost(idPost, userLocal._id);
        }
    };
    //handle comment
    const handlePostComment = async (idPost, idUser, value) => {
        const { data } = await axios.post('http://localhost:5000/post/comment', {
            idPost,
            idUser,
            content: value,
        });
    };
    const liRef = useRef();
    const handleDeletePost = async () => {
        if (liRef.current.innerHTML === 'Xóa') {
            console.log('delete');
            const { data } = await axios.delete(`http://localhost:5000/post/delete/${post?._id}`);
            if (data.status) {
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
                    <img src={post?.file} alt={post?.title} />
                </div>
                <div className="detail flex flex-column ">
                    <header className="flex j-between a-center">
                        <div className="left flex">
                            <div className="img">
                                <img src={user?.isAvatarImage ? user?.avatarImage : images.noAvatar} alt="" />
                            </div>
                            <div className="information flex a-center">
                                <Link to={`/${user?.username}`}>{user?.username}</Link>
                            </div>
                        </div>

                        <div className="right">
                            <span className="icon" onClick={() => setIsCustom(true)}>
                                <AiOutlineEllipsis />
                            </span>
                        </div>
                    </header>
                    <div className="content-comment">
                        {post?.comment.map((item, index) => {
                            const commentUser = users.find((user) => user._id === item.idUser);
                            const time = times(item.date);

                            return (
                                <div className="item-comment flex a-center" key={index}>
                                    <div className="avatar">
                                        {commentUser?.isAvatarImage ? (
                                            <img src={commentUser?.avatarImage} alt="avatar" />
                                        ) : (
                                            <img src={images.noAvatar} alt="no-avatar" />
                                        )}
                                    </div>
                                    <div className="main">
                                        <div className="flex a-center">
                                            <Link to={`/${commentUser?.username}`}>{commentUser?.username}</Link>
                                            <p className="comment">{item.content}</p>
                                        </div>
                                        <div className="times">
                                            <p>{time}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <footer>
                        <div className="interaction">
                            <div className=" flex a-center j-between ">
                                <div className="left ">
                                    <span
                                        className="like"
                                        title={isLike ? 'Bỏ thích' : 'Thích'}
                                        onClick={() => handleLike(post._id)}
                                    >
                                        {isLike ? <AiFillHeart className="red" /> : <AiOutlineHeart />}
                                    </span>
                                    <span className="comment" title="Bình luận" onClick={() => divRef.current.focus()}>
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
                            <div className="like-post-and-time">
                                <h4>{`${post?.like.length} người thích`}</h4>
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
                                        handlePostComment(post._id, userLocal._id, value);
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
                            {user?._id === userLocal._id ? (
                                <ul>
                                    <li className="delete" ref={liRef} onClick={() => handleDeletePost()}>
                                        {post?.deleted ? 'Khôi phục' : 'Xóa'}
                                    </li>
                                    <li>{post?.isComment ? 'Tắt tính năng bình luận' : 'Bật tính năng bình luận'}</li>
                                    <li>{post?.isLike ? 'Ẩn lượt thích' : 'Bật lượt thích'}</li>
                                </ul>
                            ) : (
                                <ul>
                                    <li>cc</li>
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PopupWrapper>
    );
}

export default PostPage;
