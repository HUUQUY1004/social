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
    const videoRef = useRef();
const [showReportMenu, setShowReportMenu] = useState(false); // bật tắt menu Report
const [showReportModal, setShowReportModal] = useState(false); // hiển thị Modal report
const [showReasonModal, setShowReasonModal] = useState(false); // show modal reseason report
const [reportReason, setReportReason] = useState('');
const handleReport = async (postId) => {
if (!reportReason) return alert('Vui lòng chọn lý do báo cáo');
    try {
        const response = await fetch(`${BASE_URL}/posts/${postId}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser.id,
                reason: reportReason
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Báo cáo đã được gửi.');
            setShowReportModal(false);
            setReportReason('');
        } else {
            alert('Báo cáo thất bại: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi gửi báo cáo.');
    }
};

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
                
        <>
        
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
                <div className="post-icon" style={{ position: 'relative' }}>
                    <span onClick={() => setShowReportMenu(!showReportMenu)} style={{ cursor: 'pointer' }}>
                        <AiOutlineEllipsis />
                    </span>
                </div>
                {/* Modal Report UserPost */}
                {showReportMenu && (
                <div className="report-overlay" onClick={() => setShowReportMenu(false)}>
                    <div className="report-menu" onClick={(e) => e.stopPropagation()}>
                    <span onClick={() => {
                        setShowReportMenu(false);
                        setShowReasonModal(true); 
                    }}>
                        Báo cáo
                    </span>
                    <span>Không quan tâm</span>
                    <span>Đi đến bài viết</span>
                    <span>Chia sẻ lên ...</span>
                    <span>Sao chép liên kết</span>
                    <span>Nhúng</span>
                    <span>Giới thiệu về tài khoản này</span>
                    <span onClick={() => setShowReportMenu(false)}>Hủy</span>
                    </div>
                </div>
                )}
                {/* Modal Reason Report  */}
                {showReasonModal && (
                <div className="report-overlay" onClick={() => setShowReasonModal(false)}>
                    <div className="report-reason-modal" onClick={(e) => e.stopPropagation()}>
                    <h3 className="modal-title">Báo cáo</h3>
                    <p className="modal-subtitle">Tại sao bạn báo cáo bài viết này?</p>
                    <ul className="report-reason-list">
                        {[
                        'Chỉ là tôi không thích nội dung này',
                        'Bắt nạt hoặc liên hệ theo cách không mong muốn',
                        'Tự tử, tự gây thương tích hoặc rối loạn ăn uống',
                        'Bạo lực, thù ghét hoặc bóc lột',
                        'Bán hoặc quảng cáo mặt hàng bị hạn chế',
                        'Ảnh khoả thân hoặc hoạt động tình dục',
                        'Lừa đảo, gian lận hoặc spam',
                        'Thông tin sai sự thật'
                        ].map((reason, index) => (
                        <li key={index} onClick={() => handleReport(item.id, reason)}>
                            {reason}
                        </li>
                        ))}
                    </ul>
                    <button className="cancel-btn" onClick={() => setShowReasonModal(false)}>Hủy</button>
                    </div>
                </div>
                )}
                
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
        </>
    );
}

export default PostHomeItem;
