import { Fragment, useEffect, useRef, useState } from 'react';
import './post.scss';
import axios from 'axios';
import { BiImages, BiSquare } from 'react-icons/bi';
import { BsCardImage } from 'react-icons/bs';
import { TbRectangleVertical, TbRectangle } from 'react-icons/tb';
import { IoIosArrowUp } from 'react-icons/io';
import { AiOutlineArrowLeft, AiOutlineClose, AiOutlineZoomIn } from 'react-icons/ai';
import { MdContentCopy, MdKeyboardArrowDown, MdOutlineZoomOutMap } from 'react-icons/md';
import { CiFaceSmile } from 'react-icons/ci';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import Notify from '../Notify/Notify';
// Content
import { images } from '../../source';
import Picker from 'emoji-picker-react';
const editSize = [
    {
        name: 'Gốc',
        icon: <BsCardImage />,
    },
    {
        name: '1:1',
        icon: <BiSquare />,
    },
    {
        name: '4:5',
        icon: <TbRectangleVertical />,
    },
    {
        name: '9:16',
        icon: <TbRectangle />,
    },
];
function Post({ onClose, user }) {
    const innerRef = useRef();
    const inputRef = useRef();
    const divRef = useRef();
    const [edit, setEdit] = useState(false);
    const [img, setImg] = useState(undefined);
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(undefined);
    const [showEditSize, setShowEditSize] = useState(false);
    const [width, setWidth] = useState(false);
    const [showInputRange, setShowInputRange] = useState(false);
    const [inputRange, setInputRange] = useState(0);
    const [fileUp, setFileUp] = useState('');
    //content
    const [content, setContent] = useState('');
    const [count, setCount] = useState(0); //đếm số lượng từ
    const [showPicker, setShowPicker] = useState(false);
    const [openFeature, setOpenFeature] = useState(false);
    const [isComment, setIsComment] = useState(true);
    const [isShowLike, setIsShowLike] = useState(true);
    // UP Post

    useOnClickOutside(innerRef, () => {
        if (img) {
            setShow(true);
            setShowEditSize(false);
        } else return onClose(false);
    });
    const handleFileUpload = (e) => {
        const input = e.target.parentNode.querySelector('input[type=file]');
        input.click();
    };

    function imageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileUp(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        // Xử lý file ảnh tại đây, ví dụ: gửi lên máy chủ hoặc xử lý dữ liệu
        imageToBase64(file).then((base64) => {
            // setFileUp(base64);
        });
        setEdit(true);
        setImg(URL.createObjectURL(file));
    };
    const divLength = () => {
        const value = divRef.current.innerHTML;
        setContent(value);
        if (value)
            if (value.length > 2000) {
                return;
            } else {
                setCount(value.length);
            }
    };
    const handleEmojiClick = (emoji) => {
        let msg = content;
        msg += emoji.emoji;
        divRef.current.innerHTML = msg;
        setContent(msg);
    };
    const handleUpPost = async () => {
        const { data } = await axios.post(`http://localhost:5000/post/create/${user._id}`, {
            title: content,
            file: fileUp,
            isComment,
            isShowLike,
            scaleImage: parseFloat(`1.${inputRange}`),
        });
        if (data.status === true) {
            onClose(false);
        }
    };
    return (
        <div className="post__wrapper flex a-center j-center">
            <div className="close" onClick={() => onClose(false)}>
                <AiOutlineClose />
            </div>
            <div className={width ? 'inner flex size flex-column' : 'inner flex wrap flex-column none'} ref={innerRef}>
                <div className={`post-titles flex ${img ? 'j-between' : 'j-center'} a-center`}>
                    {img && (
                        <button
                            className="btn-edit"
                            onClick={() => {
                                if (width) return setWidth(false);
                                else return setShow((prev) => !prev);
                            }}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                    )}
                    <h3 className="title">{img ? 'Cắt' : 'Tạo bài viết mới '}</h3>
                    {img && (
                        <h4
                            className="continue"
                            onClick={() => {
                                setWidth(true);
                                if (width) {
                                    handleUpPost();
                                }
                            }}
                        >
                            {width ? 'Chia sẻ' : 'Tiếp'}
                        </h4>
                    )}
                </div>

                <div className="main-upload flex wrap">
                    <div className="main-edit">
                        {edit ? (
                            <div className="upload">
                                <img
                                    className={`img-file ${'s' + selected}`}
                                    style={{ transform: `scale(1.${inputRange})` }}
                                    src={img}
                                    alt=""
                                />

                                <div className="edit flex j-between a-center">
                                    <div className="left flex ">
                                        <span className="bg  flex a-center j-center size-img">
                                            <MdOutlineZoomOutMap onClick={() => setShowEditSize(!showEditSize)} />
                                            {showEditSize && (
                                                <div className="edit-size">
                                                    {editSize.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className={
                                                                selected === index
                                                                    ? 'item-edit-size active flex a-center j-center'
                                                                    : 'item-edit-size flex a-center j-center'
                                                            }
                                                            onClick={() => {
                                                                setSelected(index);
                                                            }}
                                                        >
                                                            <p>{item.name}</p>
                                                            <span>{item.icon}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </span>
                                        <span className="bg flex a-center j-center ">
                                            <AiOutlineZoomIn onClick={() => setShowInputRange(!showInputRange)} />
                                            {showInputRange && (
                                                <div className="zoom flex a-center j-center">
                                                    <input
                                                        type="range"
                                                        name=""
                                                        id=""
                                                        min={0}
                                                        max={99}
                                                        value={inputRange}
                                                        onChange={(e) => setInputRange(e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                    <div className="right ">
                                        <span className="bg flex a-center j-center ">
                                            <MdContentCopy />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="post_content flex flex-column a-center j-center">
                                <p className="post-icon">
                                    <BiImages />
                                </p>
                                <p className="post-description">Kéo ảnh và video vào đây</p>
                                <button type="button" className="post-input" onClick={(e) => handleFileUpload(e)}>
                                    Chọn từ máy tính
                                </button>
                                <input
                                    type="file"
                                    accept="image/* , video/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                        )}
                    </div>
                    <div className="add-title-post">
                        <div className="user flex">
                            <div className="avatar">
                                {user?.isAvatarImage ? (
                                    <img src={user?.avatarImage} alt="" className="avatarUser" />
                                ) : (
                                    <img src={images.noAvatar} alt="" className="avatarUser" />
                                )}
                            </div>
                            <p className="username-post">{user?.username}</p>
                        </div>
                        <div
                            className="post-value-area"
                            contentEditable={true}
                            aria-label="Viết chú thích..."
                            ref={divRef}
                            defaultValue={content}
                            onInput={divLength}
                        ></div>
                        <div className="icon flex a-center j-between">
                            <span style={{ cursor: 'pointer' }} onClick={() => setShowPicker(!showPicker)}>
                                <CiFaceSmile />
                                {showPicker && (
                                    <div className="emoji">
                                        <Picker onEmojiClick={handleEmojiClick} previewConfig={false} />
                                    </div>
                                )}
                            </span>
                            <span>{count}/2000</span>
                        </div>

                        <div className="feature">
                            <div
                                className=" feature-header flex a-center j-between"
                                onClick={() => setOpenFeature(!openFeature)}
                            >
                                <span>Cài đặt nâng cao</span>
                                <span className="icon-feature flex">
                                    {openFeature ? <IoIosArrowUp /> : <MdKeyboardArrowDown />}
                                </span>
                            </div>
                            {openFeature && (
                                <div
                                    className="feature-body"
                                    style={openFeature ? { height: '303px' } : { height: '0' }}
                                >
                                    <div className="feature-item">
                                        <div className="flex a-center j-between">
                                            <h4 className="feature-name">
                                                Ẩn lượt thích và lượt xem trên bài viết này
                                            </h4>
                                            <div
                                                className="btn-switch"
                                                onClick={() => setIsShowLike(!isShowLike)}
                                                style={
                                                    isShowLike
                                                        ? { backgroundColor: '#737373' }
                                                        : { backgroundColor: '#0095f6' }
                                                }
                                            >
                                                <div
                                                    className="circle"
                                                    style={
                                                        isShowLike
                                                            ? { transform: `translateX(${0})` }
                                                            : {
                                                                  transform: `translateX(${17}px)`,
                                                              }
                                                    }
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="feature-description">
                                            <p>
                                                Chỉ bạn mới nhìn thấy tổng số lượt thích và lượt xem bài viết này. Về
                                                sau, bạn có thể thay đổi tùy chọn này bằng cách mở menu ··· ở đầu bài
                                                viết. Để ẩn số lượt thích trên bài viết của người khác, hãy đi đến phần
                                                cài đặt tài khoản
                                            </p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="flex a-center j-between">
                                            <h4 className="feature-name">Tắt tính năng bình luận</h4>
                                            <div
                                                className="btn-switch"
                                                onClick={() => setIsComment(!isComment)}
                                                style={
                                                    isComment
                                                        ? { backgroundColor: '#737373' }
                                                        : { backgroundColor: '#0095f6' }
                                                }
                                            >
                                                <div
                                                    className="circle"
                                                    style={
                                                        isComment
                                                            ? { translate: 'translateX(0)' }
                                                            : {
                                                                  transform: 'translateX(17px)',
                                                              }
                                                    }
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="feature-description">
                                            <p>
                                                Về sau, bạn có thể thay đổi tùy chọn này bằng cách mở menu ··· ở đầu bài
                                                viết.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {show ? (
                <Notify
                    title={'Bỏ bài viết?'}
                    content={'Nếu rời đi, bạn sẽ mất những gì vừa chỉnh sửa'}
                    onCloseNotify={setShow}
                    setImg={setImg}
                    onClose={onClose}
                />
            ) : (
                <Fragment />
            )}
        </div>
    );
}

export default Post;
