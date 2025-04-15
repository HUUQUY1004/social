import { AiOutlineClose } from 'react-icons/ai';
import './modal.scss';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../store/useStore';
import { createAlbum } from '../../action/action';

function ModalSaving({ onClose }) {
    const savingRef = useRef();
    const {currentUser} = useUser()
    useOnClickOutside(savingRef, () => onClose(false));
    const [value, setValue] = useState('');
    const handleSubmit = async () => {
        const data = await createAlbum({name: value})
        if(data.status ===200){
            onClose(false)
        }
        
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
