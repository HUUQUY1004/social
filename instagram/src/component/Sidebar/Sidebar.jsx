import {
    faAnchorCircleExclamation,
    faBars,
    faBookmark,
    faChevronRight,
    faClapperboard,
    faClockRotateLeft,
    faCompass,
    faGear,
    faHeart,
    faHome,
    faHomeLgAlt,
    faMagnifyingGlass,
    faMessage,
    faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BsFillSunFill } from 'react-icons/bs';
import { AiOutlineSetting } from 'react-icons/ai';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './sidebar.scss';
import { useRef, useState } from 'react';
import { images } from '../../source';
import Popup from '../Popup/Popup';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import Post from '../Post/Post';
import TranSlate from '../Translate/Translate';
import Search from '../Search/Search';
import ConvertAccount from '../CovertAccount/ConvertAccount';

function Sidebar({ currentUser }) {
    const Menu = [
        {
            name: 'Trang chủ',
            icon: <FontAwesomeIcon icon={faHomeLgAlt} />,
            link: '/',
        },
        {
            name: 'Explore',
            icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
        },
        {
            name: 'Khám phá',
            icon: <FontAwesomeIcon icon={faCompass} />,
            link: '/explore',
        },
        {
            name: 'Reels',
            icon: <FontAwesomeIcon icon={faClapperboard} />,
            link: '/reels',
        },
        {
            name: 'Tin nhắn',
            icon: <FontAwesomeIcon icon={faMessage} />,
            link: '/direct/inbox',
        },
        {
            name: 'Thông báo',
            icon: <FontAwesomeIcon icon={faHeart} />,
        },
        {
            name: 'Tạo',
            icon: <FontAwesomeIcon icon={faSquarePlus} />,
        },
    ];
    const popUp = [
        {
            icon: <AiOutlineSetting />,
            name: 'Cài đặt',
            direct: <MdOutlineKeyboardArrowRight />,
            link: '/account/edit',
        },
        {
            icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
            name: 'Hoạt động của bạn',
            direct: <MdOutlineKeyboardArrowRight />,
            link: '/your_activity/interactions',
        },
        {
            icon: <FontAwesomeIcon icon={faBookmark} />,
            name: 'Đã lưu',
            direct: <MdOutlineKeyboardArrowRight />,
            link: `/${currentUser.username}/saved`,
        },
        {
            icon: <BsFillSunFill />,
            name: 'Chuyển chế độ',
            direct: <MdOutlineKeyboardArrowRight />,
            link: ' account/edit/',
        },
        {
            icon: <FontAwesomeIcon icon={faAnchorCircleExclamation} />,
            name: 'Báo cáo sự cố',
            direct: <MdOutlineKeyboardArrowRight />,
            type: 'show_modal',
        },
        {
            name: 'Chuyển tài khoản',
            direct: <MdOutlineKeyboardArrowRight />,
            separator: true,
            type: 'Convert',
        },
        {
            name: 'Đăng xuất',
            type: 'Logout',
        },
    ];
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [createPost, setCreatePost] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isConvert, setIsConvert] = useState(false);
    const moreRef = useRef();
    // Search
    const searchRef = useRef();
    useOnClickOutside(searchRef, () => setIsSearch(false));
    const handleClickOutside = () => {
        setIsShowPopup(false);
    };

    useOnClickOutside(moreRef, handleClickOutside);
    const handleClinkPopup = (item) => {
        if (item.type === 'Logout') {
            localStorage.removeItem('instagram-user');
            window.location.reload(false);
        }
        if (item.type === 'Convert') {
            setIsConvert(true);
        }
    };
    const handleClick = (name) => {
        if (name === 'Tạo') {
            setCreatePost(true);
        }
        if (name === 'Explore') {
            setIsSearch(true);
        }
    };
    const navigate = useNavigate();
    return (
        <div className="sidebar__wrapper">
            <div className="logo" onClick={() => navigate('/')}></div>
            <div className="sidebar">
                {Menu.map((item, index) => {
                    if (item.link) {
                        return (
                            <div className="sidebar-item br-8" key={index}>
                                <NavLink to={item.link} className="flex a-center">
                                    <p className="icon">{item.icon}</p>
                                    <p className="text">{item.name}</p>
                                </NavLink>
                            </div>
                        );
                    } else {
                        return (
                            <div className="sidebar-item br-8" key={index} onClick={() => handleClick(item.name)}>
                                <div className="flex item">
                                    <p className="icon">{item.icon}</p>
                                    <p className="text">{item.name}</p>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
            <div className="current-user br-8">
                <div className="flex">
                    <p className="avatar">
                        {currentUser.isAvatarImage ? (
                            <img src={currentUser.avatarImage} />
                        ) : (
                            <img src={images.noAvatar} alt="default" />
                        )}
                    </p>
                    <NavLink to={`/${currentUser.username}`} className="link">
                        Trang cá nhân
                    </NavLink>
                </div>
            </div>
            <div className="more flex a-center" ref={moreRef}>
                <FontAwesomeIcon icon={faBars} />
                <h4 onClick={() => setIsShowPopup((prev) => !prev)}>Xem thêm</h4>
                {isShowPopup && <Popup popup={popUp} onClick={handleClinkPopup} />}
            </div>
            {createPost && <Post onClose={setCreatePost} user={currentUser} />}
            {isSearch && (
                <div ref={searchRef}>
                    <Search />
                </div>
            )}
            {isConvert && <ConvertAccount onClose={setIsConvert} />}
        </div>
    );
}
export default Sidebar;
