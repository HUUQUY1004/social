import { AiOutlineClose } from 'react-icons/ai';
import './popup.scss';
import { Fragment } from 'react';
function PopupWrapper({ children, onClose, isClose }) {
    return (
        <div className="wrapper-for-popup flex a-center j-center">
            {isClose ? (
                <div className="close-popup" onClick={() => onClose(false)}>
                    <AiOutlineClose />
                </div>
            ) : (
                <Fragment />
            )}
            <div className="inner-popup">{children}</div>
        </div>
    );
}

export default PopupWrapper;
