import { useState, useRef } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import Picker from 'emoji-picker-react';
import { AiOutlineHeart } from 'react-icons/ai';
import './chatinput.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

function ChatInput({ handleSendMess }) {
    const [showPicker, setShowPicker] = useState(false);
    const [msg, setMsg] = useState('');
    const [image, setImage] = useState(undefined);
    const [file, setFile] = useState(undefined);
    const fileInputRef = useRef(null);

    const handleShowPicker = () => {
        setShowPicker(!showPicker);
    };

    const handleEmojiClick = (emoji) => {
        setMsg((prev) => prev + emoji.emoji);
    };

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (msg.trim() || file) {
            handleSendMess(msg, file);
            setMsg('');
            setFile(null);
            setImage(null)
        }
    };

    return (
        <div className='chat-input__wrapper'>
            {image && <img className='h-11 w-auto' src={image} alt="image" />}
            <div className=" chat-input-inner flex a-center">
                <div className="button-container" onClick={handleShowPicker}>
                    <CiFaceSmile />
                    {showPicker && (
                        <div className="emoji-pick">
                            <Picker previewConfig={false} onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
                <form className="input-container" onSubmit={sendChat}>
                    <input
                        type="text"
                        placeholder="Type your message here"
                        className="input"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    <button type="button" onClick={handleFileUpload}>
                        <FontAwesomeIcon className="text-blue-500 text-2xl mr-4" icon={faImage} />
                    </button>
                    <button type="submit" className="submit-btn">
                        {msg.length === 0 && !image  ? <AiOutlineHeart /> : 'Gửi'}
                    </button>
                </form>
                <input
                    type="file"
                    accept="image/*, video/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
            </div>
        </div>
    );
}

export default ChatInput;
