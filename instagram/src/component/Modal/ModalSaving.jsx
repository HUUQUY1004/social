import { AiOutlineClose } from 'react-icons/ai';
import './modal.scss';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function ModalSaving({ onClose, dataUser }) {
    const savingRef = useRef();
    useOnClickOutside(savingRef, () => onClose(false));
    const [value, setValue] = useState('');
    const handleSubmit = async () => {
        const { data } = await axios.post(`http://localhost:5000/api/user/${dataUser._id}/create-album`, {
            name: value,
        });
        console.log(data);
    };
    return (
        <div className="modal__saving flex a-center j-center">
            <div className="inner flex flex-column a-center j-center" ref={savingRef}>
                <div className="saving-title flex a-center">
                    <h3>Bộ sưu tập mới</h3>
                    <p onClick={() => onClose(false)}>
                        <AiOutlineClose />
                    </p>
                </div>
                <div className="saving-input flex a-center j-center">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Tên bộ sưu tập"
                        className="input"
                    />
                </div>
                <div
                    className={
                        value.length > 0
                            ? 'saving-create album flex a-center j-center'
                            : 'saving-create flex a-center j-center'
                    }
                >
                    <p className="done" onClick={handleSubmit}>
                        Tiếp
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ModalSaving;
