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
    faUserGroup,
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
import { BASE_URL } from '../../action/action';
import { useUser } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import i18n from '../../config/i18n';

function Sidebar({ onCreatePost, onSearch, onNotify, onConvertAccount }) {
    const {t} = useTranslation()
    const {currentUser} = useUser()
    const Menu = [
        {
            name: t('home'),
            icon: <FontAwesomeIcon icon={faHomeLgAlt} />,
            link: '/',
        },
        {
            name: t('explore'),
            icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
        },
        {
            name: t('friends'),
            icon: <FontAwesomeIcon icon={faUserGroup}/>,
            link: '/suggestion-friendships',
        },
        {
            name: t("discover"),
            icon: <FontAwesomeIcon icon={faCompass} />,
            link: '/explore',
        },
        {
            name: t('reels'),
            icon: <FontAwesomeIcon icon={faClapperboard} />,
            link: '/reels',
        },
        {
            name: t('messages'),
            icon: <FontAwesomeIcon icon={faMessage} />,
            link: '/direct/inbox',
        },
        {
            name: t("notifications"),
            icon: <FontAwesomeIcon icon={faHeart} />,
        },
        {
            name: t('create'),
            icon: <FontAwesomeIcon icon={faSquarePlus} />,
        },
    ];
    const popUp = [
        {
            icon: <AiOutlineSetting />,
            name: t('settings'),
            direct: <MdOutlineKeyboardArrowRight />,
            link: '/account/edit',
        },
        {
            icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
            name: t("activity"),
            direct: <MdOutlineKeyboardArrowRight />,
            link: '/your_activity/interactions',
        },
        {
            icon: <FontAwesomeIcon icon={faBookmark} />,
            name: t("saved"),
            direct: <MdOutlineKeyboardArrowRight />,
            link: `/${currentUser.username}/saved`,
        },
        {
            icon: <BsFillSunFill />,
            name: t('switch_mode'),
            direct: <MdOutlineKeyboardArrowRight />,
            link: ' account/edit/',
        },
        {
            icon: <FontAwesomeIcon icon={faAnchorCircleExclamation} />,
            name: t('report_problem'),
            direct: <MdOutlineKeyboardArrowRight />,
            type: 'show_modal',
        },
        {
            name: t('switch_account'),
            direct: <MdOutlineKeyboardArrowRight />,
            separator: true,
            type: 'Convert',
        },
        {
            name: t('changeLanguage'),
            direct: <MdOutlineKeyboardArrowRight />,
            separator: true,
            children: [
                {
                    value: "vi",
                    name: t("vietnamese")
                },{
                    value: 'en',
                    name: t("english")
                }
            ]
        },
        {
            name: t('logout'),
            type: 'Logout',
        },
    ];
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [createPost, setCreatePost] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isNotify, setIsNotify] = useState(false);
    const [isConvert, setIsConvert] = useState(false);
    const moreRef = useRef();
    // Search
    const searchRef = useRef();
    const notifyRef = useRef();
    useOnClickOutside(searchRef, () => setIsSearch(false));
    useOnClickOutside(notifyRef, () => setIsNotify(false));
    const handleClickOutside = () => {
        setIsShowPopup(false);
    };

    useOnClickOutside(moreRef, handleClickOutside);
    const handleClinkPopup = (item) => {
        if (item.type === 'Logout') {
            localStorage.removeItem('access_token');
            navigate("/login")
        }
        if (item.type === 'Convert') {
            onConvertAccount();
        }
        if(item.value === 'vi'){
            i18n.changeLanguage(item.value)
        }
        if(item.value ==='en'){
            i18n.changeLanguage(item.value)
        }
    };
    const handleClick = (name) => {
        if (name === t("create")) onCreatePost(currentUser);
        if (name === t("explore")) {
            onSearch()
        };
        if (name === t("notifications")) onNotify();
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
                        {currentUser.avatar ? (
                            <img src={ `${BASE_URL}`+currentUser.avatar} />
                        ) : (
                            <img src={images.noAvatar} alt="default" />
                        )}
                    </p>
                    <NavLink to={`/profile`} className="link">
                        {t("profile")}
                    </NavLink>
                </div>
            </div>
            <div className="more flex a-center" ref={moreRef}>
                <FontAwesomeIcon icon={faBars} />
                <h4 onClick={() => setIsShowPopup((prev) => !prev)}>{t("see_more")}</h4>
                {isShowPopup && <Popup popup={popUp} onClick={handleClinkPopup} />}
            </div>
            
        </div>
    );
}
export default Sidebar;
