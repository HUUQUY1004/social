import { Link, NavLink } from 'react-router-dom';
import './popup.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
function Popup({popup, onClick}) {
    const {t} = useTranslation()
    const [stack, setStack] = useState([popup]);
    const currentItems = stack[stack.length - 1];

    const handleItemClick = (item) => {
        if (item.children) {
            setStack(prev => [...prev, item.children]);
        } else {
            onClick(item);
        }
    };

    const handleBack = () => {
        setStack(prev => prev.slice(0, prev.length - 1));
    };
    return ( 
        <div className="popup__wrapper">
                <div className='top'>
                    {stack.length > 1 && (
                        <div className="popup-item flex a-center j-between back" onClick={handleBack}>
                            <div className='item-left flex a-center'>
                                <div className="icon">
                                    <FontAwesomeIcon icon={faBackward}/>
                                </div>
                                <div className="text">{t("back")}</div>
                            </div>
                        </div>
                    )}
                    {currentItems.map((item, index) => {
                    const Tag = item.type || item.link ? 'div' : NavLink;
                    return (
                        <Tag
                            onClick={() => handleItemClick(item)}
                            to={item.link || undefined}
                            key={index}
                            className={item.separator ? "popup-item flex a-center j-between separator" : "popup-item flex a-center j-between"}
                        >
                            <div className='item-left flex a-center'>
                                <div className="icon">{item.icon}</div>
                                <div className="text">{item.name}</div>
                            </div>
                            <div className='item-right'>
                                <div className="icon">{item.direct}</div>
                            </div>
                        </Tag>
                    );
                })}
                </div>
            </div>
     );
}

export default Popup;