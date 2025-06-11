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
            <div>
                <div className="logo hidden xl:block" onClick={() => navigate('/')}></div>
                <div className='xl:hidden flex justify-center'>
                    <svg aria-label="Instagram" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Instagram</title><path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path></svg>
                </div>
            </div>
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
