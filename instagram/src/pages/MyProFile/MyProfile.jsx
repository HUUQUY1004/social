import { Fragment, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import { RiSettings5Line } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { images } from '../../source';
import './myprofile.scss';
import { AiOutlineCamera, AiOutlineTable, AiOutlineTags } from 'react-icons/ai';
import { FiTrash2 } from 'react-icons/fi';
import { BsBookmark } from 'react-icons/bs';
import axios from 'axios';
import Loading from '../../component/Loading/loading';
import Footer from '../../component/Footer/Footer';
import Post from '../../component/Post/Post';
import ModalSaving from '../../component/Modal/ModalSaving';
import PostList from '../../component/PostList/PostList';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import PopupWrapper from '../../component/PopupWrapper/PopupWrapper';
import { useParams } from 'react-router-dom';
import { following, unFollowing } from '../../component/func/commonFunc';
import { BASE_URL, getMyProfile } from '../../action/action';
import ChangeDescription from '../../component/Change/Description/description';
import ChangeAvatar from '../../component/Change/Avatar/avatar';
function Profile() {
    const [dataUser, setDataUser] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [IsLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [showPost, setShowPost] = useState(false);
    const [showNewSaving, setShowNewSaving] = useState(false);
    const [showChangeDescription, setShowChangeDescription] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [showPopup, setShowPopup] = useState(false); //ở chỗ bánh răng
    const [postList, setPostList] = useState([]);

    // ref flow and unflow
    const flowRef = useRef();

    const getCurrentUser = async () => {
        const data = await getMyProfile()
        setCurrentUser(data.user);
    };
    useEffect(() => {
        getCurrentUser();
    }, []);
    const getPost = async () => {
        // const { data } = await axios.get(`http://localhost:5000/post/get-post/${dataUser?._id}`);
        // setPostList(data.posts);
    };

    useEffect(() => {
        getPost();
    }, [dataUser]);
    const nav = [
        {
            name: 'BÀI VIẾT',
            icon: <AiOutlineTable />,
        },
        {
            name: currentUser?._id === dataUser?._id ? 'ĐÃ LƯU' : 'REELS',
            icon: <BsBookmark />,
        },
        {
            name: 'ĐƯỢC GẮN THẺ',
            icon: <AiOutlineTags />,
        },
    ];
    const textFlow = 'Theo dõi';
    const textUnFlow = 'Bỏ theo dõi';
    return (
        <div className="profile__wrapper">
            {IsLoading ? (
                <Loading />
            ) : (
                <div className="profile flex j-center a-center flex-column">
                    <div className="information flex">
                        <div className="img" onClick={()=>setShowChangeAvatar(true)}>
                            <img src={currentUser?.avatar ? `${BASE_URL +currentUser?.avatar}` : 
                                images.noAvatar} alt="avatar" />
                        </div>
                        <div className="infor flex flex-column">
                            <div className="top flex a-center">
                                <h3 className="username">{currentUser?.username}</h3>
                                {currentUser?._id === dataUser?._id ? (
                                    <div className="flex a-center ">
                                        <button className="br-8 btn">Chỉnh sửa trang cá nhân</button>
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
                                    <span>{postList.length}</span>
                                    bài viết
                                </h3>
                                <h3 className="count_followers">
                                    <span>0</span>
                                    người theo dõi
                                </h3>
                                <h3 className="count_following">
                                    Đang theo dõi <span>0</span>người dùng
                                </h3>
                            </div>
                            <div className="bottom">
                                <h4  className="name cursor-pointer" onClick={()=>setShowChangeDescription(true)}>{(currentUser?.description.length!==0  ) ? currentUser?.description : 'Thêm mô tả' }</h4>
                            </div>
                        </div>
                    </div>
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
                                    {currentUser?._id === dataUser?._id ? (
                                        <div>
                                            {postList.length === 0 ? (
                                                <div className="up-post flex flex-column a-center ">
                                                    <div className="icon flex a-center j-center">
                                                        <AiOutlineCamera />
                                                    </div>
                                                    <h1 className="title">Chia sẻ ảnh</h1>
                                                    <p className="description">
                                                        Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn{' '}
                                                    </p>
                                                    <p className="share-fist" onClick={() => setShowPost(true)}>
                                                        Chia sẻ ảnh đầu tiên của bạn
                                                    </p>
                                                    <Link
                                                        className="trash flex a-center"
                                                        to={`/${currentUser?.id}/trash`}
                                                    >
                                                        <span>
                                                            <FiTrash2 />
                                                        </span>
                                                        <p>Thùng rác</p>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <PostList data={postList} />
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {postList?.length === 0 ? (
                                                <div>Không có bài đăng</div>
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
                                            <div className="text">Chỉ mình bạn có thể xem mục mình đã lưu</div>
                                            <div className="new-album" onClick={() => setShowNewSaving(true)}>
                                                + Bộ sưu tập
                                            </div>
                                        </div>
                                    </div>
                                    {dataUser?.saving.length > 0 ? (
                                        <div className=" album flex j-between wrap">
                                            <div className="item-album">
                                                <h4 className="name">Tất cả bài viết</h4>
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
                                            <h1 className="title">Lưu</h1>
                                            <p className="description">
                                                Lưu ảnh và video mà bạn muốn xem lại. Sẽ không có ai được thông báo và
                                                chỉ mình bạn có thể xem những gì mình đã lưu.
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
                                        <h1 className="title">Ảnh có mặt bạn</h1>
                                        <p className="description">
                                            Khi mọi người gắn thẻ bạn trong ảnh, ảnh sẽ xuất hiện tại đây.
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
            {showNewSaving ? <ModalSaving onClose={setShowNewSaving} dataUser={currentUser} /> : <Fragment />}
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
