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
import { createPost, sendImageToBLIP } from '../../action/action';
import { useTranslation } from 'react-i18next';
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
    const {t} = useTranslation()
    const innerRef = useRef();
    const inputRef = useRef();
    const divRef = useRef();
    const [edit, setEdit] = useState(false);
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined)
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
    const [typeView, setTypeView] = useState("PUBLIC")
    const [caption, setCaption] = useState()
    const [showSuggestion, setShowSuggestion] = useState(false)
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
    const toBase64 =  (file) =>
        new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
  

    const handleImageUpload =async (event) => {
        const file = event.target.files[0];
        setFileUp(file)
        if(file.name.endsWith(".mp4")){
            const reader = new FileReader()

            reader.onload = (e)=>{
                const url = e.target.result;
                setEdit(true);
                setVideo(url)
                
            }
            reader.readAsDataURL(file)
        }
        else{
            const base64 = await toBase64(file)
            
            setEdit(true);
            setImg(URL.createObjectURL(file));
            const data = await sendImageToBLIP(base64)
    
            if(data.caption){
                setCaption(data.caption)
                setShowSuggestion(true)
            }
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Tab' && showSuggestion) {
            e.preventDefault();
            setContent(caption);
            divRef.current.innerText = caption;
            setCount(caption.length);
            setShowSuggestion(false);
        }
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
        console.log(fileUp);
        
       const value= {
            title: content,
            images: fileUp,
            video: fileUp.type === "video/mp4" ? fileUp : null,
            isComment,
            isShowLike,
            scaleImage: parseFloat(`1.${inputRange}`),
            postVisibility: typeView
        };
        const data = await createPost(value)
        console.log(data);
        
        if (data) {
            onClose(false);
        }
    };
    
    
    return (
        <div className="post__wrapper flex a-center j-center">
            <div className="close" onClick={() => onClose(false)}>
                <AiOutlineClose />
            </div>
            <div className={width ? 'inner flex size flex-column' : 'inner flex wrap flex-column none'} ref={innerRef}>
                <div className={`post-titles flex ${(img || video) ? 'j-between' : 'j-center'} a-center`}>
                    {(img || video) && (
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
                    <h3 className="title">{img || video ? t("cut") : t("create_new_post")}</h3>
                    {(img || video) && (
                        <h4
                            className="continue"
                            onClick={() => {
                                setWidth(true);
                                if (width) {
                                    handleUpPost();
                                }
                            }}
                        >
                            {width ? t("share") : t("continue")}
                        </h4>
                    )}
                </div>

                <div className="main-upload flex wrap">
                    <div className="main-edit">
                        {edit ? (
                            <div className="upload">
                                {
                                    img && <img
                                    className={`img-file ${'s' + selected}`}
                                    style={{ transform: `scale(1.${inputRange})` }}
                                    src={img}
                                    alt=""
                                />
                                }
                                {
                                    video && <video className='w-full h-full' src={video} autoPlay={true} loop />
                                }

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
                                <p className="post-description">{t("drag")}</p>
                                <button type="button" className="post-input" onClick={(e) => handleFileUpload(e)}>
                                    {t("choose_file")}
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
                                {user?.avatar ? (
                                    <img src={'http://localhost:5000'+ user?.avatar} alt="" className="avatarUser" />
                                ) : (
                                    <img src={images.noAvatar} alt="" className="avatarUser" />
                                )}
                            </div>
                            <p className="username-post">{user?.username}</p>
                        </div>
                        <div className='relative'>
                            <div
                                className="post-value-area"
                                contentEditable={true}
                                ref={divRef}
                                onInput={divLength}
                                onKeyDown={handleKeyDown}
                                suppressContentEditableWarning={true}
                                aria-label= 'Viết chú thích'
                            ></div>
    
                            {showSuggestion && caption && (
                                <div
                                    className="caption-suggestion"
                                    style={{
                                        position: 'absolute',
                                        top: '25%',
                                        left: 0,
                                        background: '#f0f0f0',
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        marginTop: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        setContent(caption);
                                        divRef.current.innerText = caption;
                                        setCount(caption.length);
                                        setShowSuggestion(false);
                                    }}
                                >
                                    💡 {t("suggest_caption")} : <em>{caption}</em> <br />
                                    <small>{t("press")}</small>
                                </div>
                            )}
                        </div>
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
                                <span>{t("adv_settings")}</span>
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
                                               {t("post_viewers")}
                                            </h4>
                                            <select className='text-xs' onChange={(e)=>setTypeView(e.target.value)}>
                                                <option value='PUBLIC'> 
                                                    {t("public")}
                                                </option>
                                                <option value='FRIENDS_ONLY'>{t("friends")}</option>
                                                <option value='PRIVATE'>{t("only_me")}</option>
                                            </select>
                                        </div>
                                        <div className="feature-description">
                                            <p>
                                              {t("choose_view")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="flex a-center j-between">
                                            <h4 className="feature-name">
                                                {t("hide_like")}
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
                                                {t("hide_like_description")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="flex a-center j-between">
                                            <h4 className="feature-name">{t("turn_off_comment")}</h4>
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
                                               {t("turn_off_comment_description")}
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
                    title={`${t("skip_post")} ?`}
                    content={t("skip_post_description")}
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
