import { images } from '../../source';
import './chatcontainer.scss';
import { Link } from 'react-router-dom';
import { CiFaceSmile } from 'react-icons/ci';
import ChatInput from '../ChatInput/ChatInput';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const getMessages = async () => {
        const response = await axios.post('http://localhost:5000/api/message/getmsg', {
            from: currentUser._id,
            to: currentChat._id,
        });
        setMessages(response.data);
    };
    useEffect(() => {
        getMessages();
    }, [currentChat]);
    const handleSendMess = async (msg) => {
        await axios.post('http://localhost:5000/api/message/addmsg', {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            msg,
        });
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    console.log(messages);
    return (
        <div
            className="chat-container__wrapper flex 
        flex-column"
        >
            <header className="header-chat flex a-center j-between">
                <div className="information-user-chat flex a-center">
                    <div className="avatar">
                        {currentChat.isAvatarImage ? (
                            <img src={currentChat.avatarImage} alt="avatar" />
                        ) : (
                            <img src={images.noAvatar} alt="avatar" />
                        )}
                    </div>
                    <h3>{currentChat.name}</h3>
                </div>
            </header>
            <div className="chat-container">
                <div className="detail-account flex flex-column a-center">
                    <div className="avatar">
                        {currentChat.isAvatarImage ? (
                            <img src={currentChat.avatarImage} alt="avatar" />
                        ) : (
                            <img src={images.noAvatar} alt="avatar" />
                        )}
                    </div>
                    <div className="information">
                        <h3>{currentChat.name}</h3>
                        <p>{currentChat.username} · Instagram</p>
                        <Link to={`/${currentChat.username}`} className="br-8">
                            Xem trang cá nhân
                        </Link>
                    </div>
                </div>
                <div className="messages flex flex-column">
                    {messages.map((message, index) => {
                        return (
                            <div key={index} ref={scrollRef}>
                                <div className={`message ${message.fromSelf ? 'sended' : 'recieved'}`}>
                                    <div className="content-mess ">
                                        <p>{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <ChatInput handleSendMess={handleSendMess} />
            </div>
        </div>
    );
}

export default ChatContainer;
