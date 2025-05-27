import { useEffect, useState } from 'react';
import './home.scss';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../component/Loading/loading';
import { images } from '../../source';
import PostHome from '../../component/PostHome/PostHome';
import ConvertAccount from '../../component/CovertAccount/ConvertAccount';
import {useUser} from '../../store/useStore'
import { getPostHome } from '../../action/action';
function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [postList, setPostList] = useState(undefined);
    const {currentUser} = useUser()
    // bên phần account
    const [isConvert, setIsConvert] = useState(false);
    const navigate = useNavigate();
    const getPost = async () => {
        const data  = await getPostHome();
        console.log(data);
        
        setPostList(data);
        setIsLoading(false);
    };
    useEffect(() => {
        getPost();

    }, []);
    return (
        <div className="home__wrapper flex">
            {isLoading ? (
                <Loading />
            ) : currentUser ? (
                <div className="home flex j-center">
                    <div className="home-post-list flex j-center">
                        <PostHome postList={postList} currentUser={currentUser} />
                    </div>
                    <div className="home-user flex j-center">
                        <div className="user-inner">
                            <div className="user-top">
                                <div className="information flex j-between a-center">
                                    <div className="user-information">
                                        <div className="flex">
                                            <div className="img">
                                                {currentUser?.isAvatarImage ? (
                                                    <img src={currentUser?.avatarImage} alt={currentUser?.username} />
                                                ) : (
                                                    <img src={images.noAvatar} alt="noAvatar" />
                                                )}
                                            </div>
                                            <div className="user">
                                                <h3 className="username">{currentUser?.username}</h3>
                                                <h3 className="name">{currentUser?.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="option" onClick={() => setIsConvert(true)}>
                                        Chuyển
                                    </p>
                                </div>
                            </div>
                            <div className="user-center">
                                <div className="top flex j-between a-center">
                                    <h5>Gợi ý cho bạn</h5>
                                    <Link>Xem tất cả</Link>
                                </div>
                                <div className="suggest-user">
                                    {null?.map((item, key) => {
                                        return (
                                            <div className="suggest-user-item flex">
                                                <div className="avatar">
                                                    <img
                                                        src={item.isAvatarImage ? item.avatarImage : images.noAvatar}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="information flex a-center j-between">
                                                    <div className="left">
                                                        <h4>{item.username}</h4>
                                                        <p>Gợi ý cho bạn</p>
                                                    </div>
                                                    <div className="right">
                                                        <span>Theo dõi</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="user-bottom">
                                <div className="link flex wrap">
                                    <Link to={'/'}>Giới thiệu</Link>
                                    <Link to={'/'}>Trợ giúp</Link>
                                    <Link to={'/'}>Báo chí</Link>
                                    <Link to={'/'}>API</Link>
                                    <Link to={'/'}>Việc làm</Link>
                                    <Link to={'/'}>Quyền riêng tư</Link>
                                    <Link to={'/'}>Điều khoản</Link>
                                    <Link to={'/'}>Vị trí</Link>
                                    <Link to={'/'}>Ngôn ngữ</Link>
                                    <Link to={'/'}>Meta đã xác minh</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isConvert && <ConvertAccount onClose={setIsConvert} />}
                </div>
            ) : (
                <div className="suggest__wrapper">
                    {/* <Suggest suggestUser={suggestUser} currentUser={currentUser} /> */}
                    <h1>Hello world</h1>
                </div>
            )}
        </div>
    );
}

export default Home;
