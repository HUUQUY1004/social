import { useRef } from 'react';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import './notify.scss';
import { useTranslation } from 'react-i18next';
function Notify({ title, content, onCloseNotify, onClose, setImg }) {
    const myRef = useRef();
    const {t} = useTranslation()
    useOnClickOutside(myRef, () => onCloseNotify(false));
    return (
        <div className="notify__wrapper flex a-center j-center">
            <div className="notify-inner flex a-center j-between flex-column" ref={myRef}>
                <h3 className="notify-title ">{title}</h3>
                <p className="notify-content">{content}</p>
                <div className="notify-btn">
                    <button
                        className="agree"
                        onClick={() => {
                            setImg(undefined);
                            onCloseNotify(false);
                            onClose(false);
                        }}
                    >
                        {t("accept")}
                    </button>
                    <button className="refuse" onClick={() => onCloseNotify(false)}>
                        {t("cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notify;
