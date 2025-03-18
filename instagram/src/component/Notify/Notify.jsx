import { useRef } from 'react';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import './notify.scss';
function Notify({ title, content, onCloseNotify, onClose, setImg }) {
    const myRef = useRef();
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
                        Bỏ
                    </button>
                    <button className="refuse" onClick={() => onCloseNotify(false)}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notify;
