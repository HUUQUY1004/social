import { images } from '../../source';
import './chatcontainer.scss';
import { Link } from 'react-router-dom';
import { CiFaceSmile } from 'react-icons/ci';
import ChatInput from '../ChatInput/ChatInput';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../store/useStore';
import { BASE_URL, getConversation, sendMessage } from '../../action/action';
import useWebSocket from '../../hook/useWebSocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import VideoCall from '../Call/call';
import PopupWrapper from '../PopupWrapper/PopupWrapper';
function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const [isCall, setIsCall] = useState(false)
    const [isCallVideo, setIsCallVideo] = useState(false)

    const {currentUser} = useUser()
    
    const getMessages = async () => {
        const data = await getConversation(currentChat.id)
        console.log(data);
        
        setMessages(data);
    };
    useEffect(() => {
        getMessages();
    }, [currentChat]);

    //Kết nối WebSocket
    useWebSocket(currentUser.id, (newMessage) => {
        if (newMessage.fromUser === currentChat.id || newMessage.toUserId === currentUser.id) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    });

    const handleSendMess = async (msg, multipart) => {
        const body ={
            formUser : currentUser.id,
            toUserId : currentChat.id,
            content : msg,
            image : multipart,
            video: ''
        }
        
        const data = await sendMessage(body)
        console.log("data",data);
        setMessages([...messages, data])

        // if(multipart){
        //     const imageUrl = URL.createObjectURL(multipart)
        //     console.log("URL FILE: " + imageUrl);
        //     setMessages([...messages, {}])
        // }
        
        // socket.current.emit('send-msg', {
        //     to: currentChat._id,
        //     from: currentUser._id,
        //     msg,
        // });
        // const msgs = [...messages];
        // msgs.push({ fromSelf: true, message: msg });
        // setMessages(msgs);
    };
    // useEffect(() => {
    //     if (socket.current) {
    //         socket.current.on('msg-recieve', (msg) => {
    //             setArrivalMessage({ fromSelf: false, message: msg });
    //         });
    //     }
    // }, []);
    // useEffect(() => {
    //     arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    // }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    console.log(isCall);
    
    return (
        <div
            className="chat-container__wrapper flex 
        flex-column"
        >
            <header className="header-chat flex a-center j-between">
                <div className="information-user-chat flex a-center">
                    <div className="avatar">
                        {currentChat.avatar ? (
                            <img className='object-cover' src={BASE_URL+ currentChat.avatar} alt="avatar" />
                        ) : (
                            <img src={images.noAvatar} alt="avatar" />
                        )}
                    </div>
                    <h3>{currentChat.username}</h3>
                </div>
                <div className='flex gap-5 mr-5'>
                    <span className='cursor-pointer p-2' onClick={()=>setIsCall(true)} >
                        <FontAwesomeIcon className='text-blue-400' icon={faPhone}/>
                    </span>
                    <span className='cursor-pointer p-2' onClick={()=> setIsCallVideo(true)}>
                        <FontAwesomeIcon className='text-blue-400' icon={faVideo}/>
                    </span>

                </div>
            </header>
            <div className="chat-container">
                <div className="detail-account flex flex-column a-center">
                    <div className="avatar">
                        {currentChat.avatar ? (
                            <img className='object-cover' src={BASE_URL+ currentChat.avatar} alt="avatar" />
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
                                <div className={`message ${currentUser.id === message.fromUser ? 'sended' : 'recieved'}`}>
                                    <div className="content-mess ">
                                        {
                                            message.imageUrl? (
                                                <img src={BASE_URL+ message.imageUrl} alt="image" />
                                            ) : (
                                                message.video? (
                                                    <video src={message.video} controls />
                                                ) : null
                                            )
                                        }
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <ChatInput handleSendMess={handleSendMess} />
            </div>
            {
            isCall &&
            <PopupWrapper>
                <VideoCall calleeId={currentChat.id}/>
            </PopupWrapper>
            }
            {
            isCallVideo &&
            <PopupWrapper>
                <VideoCall calleeId={currentChat.id} isCallVideo={isCallVideo}/>
            </PopupWrapper>
            }
        </div>
    );
}

export default ChatContainer;
