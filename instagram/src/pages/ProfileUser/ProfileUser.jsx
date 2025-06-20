import { Fragment, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import { RiSettings5Line } from 'react-icons/ri';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { images } from '../../source';
import '../MyProFile/myprofile.scss'
import { AiOutlineCamera, AiOutlineTable, AiOutlineTags } from 'react-icons/ai';
import { FiTrash2 } from 'react-icons/fi';
import { BsBookmark } from 'react-icons/bs';
import Loading from '../../component/Loading/loading';
import Footer from '../../component/Footer/Footer';
import Post from '../../component/Post/Post';
import ModalSaving from '../../component/Modal/ModalSaving';
import PostList from '../../component/PostList/PostList';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { BASE_URL, getNumberOfFriends, getPostForUserId, getUserById } from '../../action/action';
import ChangeDescription from '../../component/Change/Description/description';
import ChangeAvatar from '../../component/Change/Avatar/avatar';
import { useUser } from '../../store/useStore';
import Story from '../../component/Remarkable/Story';
import { useTranslation } from 'react-i18next';

function ProfileUser() {
    const [dataUser, setDataUser] = useState(undefined);
    const { currentUser } = useUser();
    const [IsLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [showPost, setShowPost] = useState(false);
    const [showNewSaving, setShowNewSaving] = useState(false);
    const [showChangeDescription, setShowChangeDescription] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [postList, setPostList] = useState([]);
    const [quantityFriends, setQuantityFriends] = useState(0);
    
    const params = useParams();
    const { userId } = params; 
    const {t} = useTranslation()
    
    const flowRef = useRef();

   
    const getUserData = async () => {
        if (!userId) return;
        
        setIsLoading(true);
        try {
            
            if (userId === currentUser?.id || userId === currentUser?._id) {
                setDataUser(currentUser);
            } else {
                
                const userData = await getUserById(userId);
                setDataUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getNumberOfFriend = async () => {
        if (!userId) return;
        
        try {
            const data = await getNumberOfFriends(userId); 
            setQuantityFriends(data);
        } catch (error) {
            console.error('Error fetching friends count:', error);
        }
    };

    const getPost = async () => {
        if (!userId) return;
        
        try {
            const data = await getPostForUserId(userId); // Sử dụng userId từ params
            console.log("data", data);
            setPostList(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // useEffect sẽ chạy lại khi userId thay đổi
    useEffect(() => {
        if (userId) {
            getUserData();
            getPost();
            getNumberOfFriend();
        }
    }, [userId, currentUser]); // Thêm dependency userId

    // Kiểm tra xem có phải profile của chính mình không
    const isOwnProfile = currentUser?.id === dataUser?.id || currentUser?.id === dataUser?.id;

    const nav = [
        {
            name: t("post"),
            icon: <AiOutlineTable />,
        },
        {
            name: isOwnProfile ? t("saved") : 'REELS',
            icon: <BsBookmark />,
        },
        {
            name: t("tag"),
            icon: <AiOutlineTags />,
        },
    ];

    // Hiển thị loading khi chưa có dữ liệu
    if (IsLoading || !dataUser) {
        return <Loading />;
    }

    return (
        <div className="profile__wrapper">
            <div className="profile flex j-center a-center flex-column">
                <div className="information flex">
                    <div className="img" onClick={() => isOwnProfile && setShowChangeAvatar(true)}>
                        <img 
                            src={dataUser?.avatar ? `${BASE_URL + dataUser?.avatar}` : images.noAvatar} 
                            alt="avatar" 
                        />
                    </div>
                    <div className="infor flex flex-column">
                        <div className="top flex a-center">
                            <h3 className="username">{dataUser?.username}</h3>
                            {isOwnProfile ? (
                                <div className="flex a-center ">
                                    <button className="br-8 btn">{t("edit_profile")}</button>
                                    <Link
                                        to={`/${currentUser?.id}/trash`}
                                        className="icon"
                                        title="Thùng rác"
                                        onClick={() => setShowPopup(!showPopup)}
                                    >
                                        <RiSettings5Line />
                                    </Link>
                                </div>
                            ) : (
                                <div className="user-diff flex a-center">
                                    <button className="following br-8" ref={flowRef}>
                                        {t("follow")}
                                    </button>
                                    <button className="inbox br-8">{t("send_message")}</button>
                                    <span>
                                        <BiDotsHorizontalRounded />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="center flex">
                            <h3 className="count-post">
                                <span>{postList?.length}</span>
                                {t("post")}
                            </h3>
                            <h3 className="count_followers">
                                <Link to={"/friends"}>
                                    <span>{quantityFriends}</span>
                                    {t("friends")}
                                </Link>
                            </h3>
                        </div>
                        <div className="bottom">
                            <h4 
                                className="name cursor-pointer" 
                                onClick={() => isOwnProfile && setShowChangeDescription(true)}
                            >
                                {(dataUser?.description?.length !== 0) ? dataUser?.description : (isOwnProfile ? 'Thêm mô tả' : 'Chưa có mô tả')}
                            </h4>
                        </div>
                    </div>
                </div>
                <Story />
                <div className="content-profile">
                    <div className="nav flex j-center">
                        {nav.map((item, index) => (
                            <div
                                key={index}
                                className={
                                    selected === index
                                        ? 'flex a-center j-center item active'
                                        : 'flex a-center j-center item'
                                }
                                onClick={() => setSelected(index)}
                            >
                                <span className="icon">{item.icon}</span>
                                <p className="text"> {item.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="content-by-nav flex j-center">
                        {selected === 0 ? (
                            <div className="content-ui ">
                                {isOwnProfile ? (
                                    <div>
                                        {postList?.length === 0 ? (
                                            <div className="up-post flex flex-column a-center ">
                                                <div className="icon flex a-center j-center">
                                                    <AiOutlineCamera />
                                                </div>
                                                <h1 className="title">{t("share_image")}</h1>
                                                <p className="description">
                                                    {t("share_image_description")}{' '}
                                                </p>
                                                <p className="share-fist" onClick={() => setShowPost(true)}>
                                                    {t("first_image")}
                                                </p>
                                                <Link
                                                    className="trash flex a-center"
                                                    to={`/${currentUser?.id}/trash`}
                                                >
                                                    <span>
                                                        <FiTrash2 />
                                                    </span>
                                                    <p>{t("trash_can")}</p>
                                                </Link>
                                            </div>
                                        ) : (
                                            <PostList data={postList} />
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {postList?.length === 0 ? (
                                            <div>{t("no_post")}</div>
                                        ) : (
                                            <PostList data={postList} />
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Fragment />
                        )}
                        {selected === 1 ? (
                            <div className="content-ui">
                                {isOwnProfile ? (
                                    <div>
                                        <div className="saving-empty flex flex-column">
                                            <div className="add-new-album flex j-between">
                                                <div className="text">{t("collection_description")}</div>
                                                <div className="new-album" onClick={() => setShowNewSaving(true)}>
                                                    + {t("album")}
                                                </div>
                                            </div>
                                        </div>
                                        {dataUser?.saving?.length > 0 ? (
                                            <div className=" album flex j-between wrap">
                                                <div className="item-album">
                                                    <h4 className="name">{t("all_post")}</h4>
                                                </div>
                                                {dataUser.saving.map((item, index) => {
                                                    return (
                                                        <div className="item-album" key={index}>
                                                            <h4 className="name">{item.name}</h4>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="saving-empty-content flex flex-column a-center">
                                                <div className="icon flex a-center j-center">
                                                    <BsBookmark />
                                                </div>
                                                <h1 className="title">{t('save')}</h1>
                                                <p className="description">
                                                    {t("save_description")}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="reels-content">
                                        {/* Hiển thị reels của user khác */}
                                        <div>Reels {t("belong")} {dataUser?.username}</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Fragment />
                        )}
                        {selected === 2 ? (
                            <div className="content-ui">
                                <div className="tag-you flex flex-column a-center">
                                    <div className="icon flex a-center j-center">
                                        <AiOutlineTags />
                                    </div>
                                    <h1 className="title">{t("image_is_present")} {isOwnProfile ? ' bạn' : dataUser?.username}</h1>
                                    <p className="description">
                                        {isOwnProfile 
                                            ? t("photo_in_you_description")
                                            : `${t("photo_with_tag")} ${dataUser?.username} ${t("will-appear_here")}`
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Fragment />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            {showPost ? <Post onClose={setShowPost} user={dataUser} /> : <Fragment />}
            {showNewSaving ? <ModalSaving onClose={setShowNewSaving} dataUser={currentUser} /> : <Fragment />}
            {showChangeDescription && isOwnProfile && (
                <ChangeDescription onCloseChange={setShowChangeDescription} />
            )}
            {showChangeAvatar && isOwnProfile && (
                <ChangeAvatar onOpen={setShowChangeAvatar} />
            )}
        </div>
    );
}

export default ProfileUser;