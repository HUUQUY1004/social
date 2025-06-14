import { Fragment, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { RiSettings5Line } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { images } from '../../source';
import './myprofile.scss';
import { AiOutlineCamera, AiOutlineTable, AiOutlineTags } from 'react-icons/ai';
import { FiTrash2 } from 'react-icons/fi';
import { BsBookmark } from 'react-icons/bs';
import Loading from '../../component/Loading/loading';
import Footer from '../../component/Footer/Footer';
import Post from '../../component/Post/Post';
import ModalSaving from '../../component/Modal/ModalSaving';
import PostList from '../../component/PostList/PostList';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import { BASE_URL, getAllAlbum, getNumberOfFriends, getPostForUserId, getQuantityPost, getUserById } from '../../action/action';
import ChangeDescription from '../../component/Change/Description/description';
import ChangeAvatar from '../../component/Change/Avatar/avatar';
import { useUser } from '../../store/useStore';
import Story from '../../component/Remarkable/Story';
import { useTranslation } from 'react-i18next';
function Profile() {
    const {t} = useTranslation()
    const {userId} = useParams()
    const [dataUser, setDataUser] = useState(undefined);
    const {currentUser} = useUser();
    const [IsLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [showPost, setShowPost] = useState(false);
    const [showNewSaving, setShowNewSaving] = useState(false);
    const [showChangeDescription, setShowChangeDescription] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [showPopup, setShowPopup] = useState(false); //ở chỗ bánh răng
    const [postList, setPostList] = useState([]);
    const [quantityFriends, setQuantityFriends] = useState(0);
    const [quantityPost, setQuantityPost] = useState(0)
    const [albums,setAlbums] = useState([])

    
    // ref flow and unflow
    const flowRef = useRef();


    const getNumberOfFriend = async () => {
        const data = await getNumberOfFriends()
        setQuantityFriends(data);
    }

    const getPost = async () => {
        const data = await getPostForUserId(userId? userId : currentUser.id)
        setPostList(data);
    };
    const getUser = async ()=>{

        if(userId){
            const data = await getUserById(userId)
            setDataUser(data)
        }
        else {
            setDataUser(currentUser)
        }
        
    }
    const getQuantityPosts =async()=>{
        const data = await getQuantityPost()
        setQuantityPost(data)
    }
    const getAllAlbums =async ()=>{
        const data = await getAllAlbum()
        setAlbums(data)
        console.log(data);
        
    }
    
    useEffect(()=>{
        getUser()
        getQuantityPosts()
    },[])
    useEffect(()=>{
        getAllAlbums()
    }, [showNewSaving])

    useEffect(() => {
        getPost();
        getNumberOfFriend();
    }, [dataUser]);

    const handleContextMenu = (e)=>{
        e.preventDefault(0)
        setShowChangeAvatar(currentUser.id === dataUser.id)
    }
    const nav = [
        {
            name: t("post"),
            icon: <AiOutlineTable />,
        },
        {
            name: currentUser?.id === dataUser?.id ? t("saved") : 'REELS',
            icon: <BsBookmark />,
        },
        {
            name: t("tag"),
            icon: <AiOutlineTags />,
        },
    ];
    return (
        <div className="profile__wrapper">
            {IsLoading ? (
                <Loading />
            ) : (
                <div className="profile flex j-center a-center flex-column">
                    <div className="information flex">
                        <div className="img" onContextMenu={(e)=>handleContextMenu(e)}>
                            <img src={dataUser?.avatar ? `${BASE_URL +dataUser?.avatar}` : 
                                images.noAvatar} alt="avatar" />
                        </div>
                        <div className="infor flex flex-column">
                            <div className="top flex a-center">
                                <h3 className="username">{dataUser?.username}</h3>
                                {currentUser?.id === dataUser?.id ? (
                                    <div className="flex a-center ">
                                        <Link to={'/edit-profile'} className="br-8 btn">{t("edit_profile")}</Link>
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
                                        <button
                                            className="following br-8"
                                            ref={flowRef}
                                            
                                        >
                                            Hi
                                        </button>
                                        <button className="inbox br-8">Nhắn tin</button>
                                        <span>
                                            <BiDotsHorizontalRounded />
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="center flex">
                                <h3 className="count-post">
                                    <span>{quantityPost}</span>
                                    {t('post')}
                                </h3>
                                <h3 className="count_followers">
                                    <Link to={"/friends"}>
                                        <span>{quantityFriends}</span>
                                        {
                                            t("friend")
                                        }
                                    </Link>
                                </h3>
                                
                            </div>
                            <div className="bottom">
                                <h4  className="name cursor-pointer" onClick={()=>setShowChangeDescription(currentUser?.id === dataUser?.id)}>{(dataUser?.description?.length  ) ? dataUser?.description : dataUser?.id == currentUser?.id && 'Thêm mô tả' }</h4>
                            </div>
                        </div>
                    </div>
                    <Story/>
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
                                    {currentUser?.id === dataUser?.id ? (
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
                                                        {
                                                            t("first_image")
                                                        }
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
                                    <div className="saving-empty flex flex-column">
                                        <div className="add-new-album flex j-between">
                                            <div className="text">{t("collection_description")}</div>
                                            <div className="new-album" onClick={() => setShowNewSaving(true)}>
                                                + {t("new_collect")}
                                            </div>
                                        </div>
                                    </div>
                                    {albums?.length > 0 ? (
                                        <div className=" album flex justify-start gap-4 wrap">
                                            <div className="item-album">
                                                <h4 className="name">{t("all_post")}</h4>
                                            </div>
                                            {albums?.map((item, index) => {
                                                return (
                                                    <div className="item-album" key={index}>
                                                        <Link to={`/album/${item.id}`} className="name">{item.name || 'Collection'}</Link>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="saving-empty-content flex flex-column a-center">
                                            <div className="icon flex a-center j-center">
                                                <BsBookmark />
                                            </div>
                                            <h1 className="title">{t("save")}</h1>
                                            <p className="description">
                                            {t("save_description")}
                                            </p>
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
                                        <h1 className="title">{t("photo_in_you")}</h1>
                                        <p className="description">
                                            {t("photo_in_you_description")}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Fragment />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
            {showPost ? <Post onClose={setShowPost} user={dataUser} /> : <Fragment />}
            {showNewSaving ? <ModalSaving onClose={setShowNewSaving}/> : <Fragment />}
            {
                showChangeDescription && <ChangeDescription 
                onCloseChange={setShowChangeDescription}
               />
            }
            {
                showChangeAvatar && <ChangeAvatar onOpen={setShowChangeAvatar}/>
            }
            {/* {showPopup && (
                <PopupWrapper isClose={false} onClose={showPopup}>
                    hii
                </PopupWrapper>
            )} */}
        </div>
    );
}

export default Profile;
