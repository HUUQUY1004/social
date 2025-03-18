import { useState } from 'react';
import { CiFaceSmile } from 'react-icons/ci';
import Picker from 'emoji-picker-react';
import { AiOutlineHeart } from 'react-icons/ai';
import './chatinput.scss';
function ChatInput({ handleSendMess }) {
    const [showPicker, setShowPicker] = useState(false);
    const [msg, setMsg] = useState('');
    const handleShowPicker = () => {
        setShowPicker(!showPicker);
    };
    const handleEmojiClick = (emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    };
    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length >= 1) {
            handleSendMess(msg);
            setMsg('');
        }
    };
    if (msg.startsWith(' ')) {
        setMsg('');
    }
    return (
        <div className="chat-input__wrapper flex a-center">
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
                    placeholder="type your messenger here"
                    className="input"
                    checked={true}
                    value={msg}
                    onChange={(e) => {
                        setMsg(e.target.value);
                    }}
                />
                <button type="submit" className="submit-btn">
                    {msg.length === 0 ? <AiOutlineHeart /> : 'Gửi'}
                </button>
            </form>
        </div>
    );
}

export default ChatInput;
