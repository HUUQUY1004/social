import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL, getConfig } from '../../action/action';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './UserChat.css';

const UserChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);    const connectWebSocket = () => {
        if (stompClient) {
            return; // Already connected
        }

        const socket = new SockJS(`${BASE_URL}/ws`);
        const client = Stomp.over(socket);
        
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        client.connect(headers, (frame) => {
            console.log('Connected to WebSocket:', frame);
            setStompClient(client);
            setConnected(true);

            // Subscribe to receive messages
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            if (userId) {
                client.subscribe(`/user/${userId}/queue/chat`, (message) => {
                    const chatMessage = JSON.parse(message.body);
                    console.log('Received message via WebSocket:', chatMessage);
                    setMessages(prev => {
                        // Avoid duplicate messages by checking if message already exists
                        const exists = prev.some(msg => msg.id === chatMessage.id);
                        return exists ? prev : [...prev, chatMessage];
                    });
                });
            }
        }, (error) => {
            console.error('WebSocket connection error:', error);
            setConnected(false);
            setStompClient(null);
            
            // Try to reconnect after 3 seconds if chat is open
            if (isOpen) {
                setTimeout(() => {
                    console.log('Attempting to reconnect WebSocket...');
                    connectWebSocket();
                }, 3000);
            }
        });

        client.onWebSocketError = (error) => {
            console.error('WebSocket error:', error);
            setConnected(false);
        };
    };

    const disconnectWebSocket = () => {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect();
        }
        setStompClient(null);
        setConnected(false);
    };

    const fetchChatHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/my-history`, getConfig());
            if (response.data.chats) {
                setMessages(response.data.chats);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchChatHistory();
            connectWebSocket();
        } else {
            disconnectWebSocket();
        }        return () => {
            disconnectWebSocket();
        };
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {            
            // Gửi qua WebSocket nếu có kết nối
            if (stompClient && connected && stompClient.connected) {
                console.log('Sending message via WebSocket:', newMessage);
                
                stompClient.send('/app/chat.sendToAdmin', {}, JSON.stringify({
                    message: newMessage
                }));
                
                setNewMessage('');
            } else {
                // Fallback về HTTP nếu WebSocket không khả dụng
                console.log('WebSocket not connected, using HTTP fallback');
                const response = await axios.post(
                    `${BASE_URL}/api/chat/send-to-admin`,
                    { message: newMessage },
                    getConfig()
                );

                if (response.data.chat) {
                    setMessages(prev => [...prev, response.data.chat]);
                    setNewMessage('');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    if (!isOpen) return null;

    return (
        <div className="user-chat-overlay">
            <div className="user-chat-container">
                <div className="user-chat-header">
                    <div className="chat-header-info">
                        <span className="chat-icon">💬</span>
                        <div>
                            <h3>Hỗ trợ khách hàng</h3>
                            <span className={`chat-status ${connected ? 'online' : 'offline'}`}>
                                {connected ? 'Online' : 'Đang kết nối...'}
                            </span>
                        </div>
                    </div>
                    <button className="chat-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="user-chat-messages">
                    {loading ? (
                        <div className="chat-loading">
                            <div className="loading-spinner"></div>
                            <span>Đang tải tin nhắn...</span>
                        </div>
                    ) : (
                        <>
                            {messages.length === 0 ? (
                                <div className="chat-welcome">
                                    <div className="welcome-icon">👋</div>
                                    <h4>Chào mừng bạn đến với hỗ trợ khách hàng!</h4>
                                    <p>Chúng tôi sẵn sàng hỗ trợ bạn. Hãy gửi tin nhắn để bắt đầu.</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`chat-message ${message.sender === 'USER' ? 'user-message' : 'admin-message'}`}
                                    >
                                        <div className="message-content">
                                            <p>{message.message}</p>
                                            <span className="message-time">
                                                {formatTime(message.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                <div className="user-chat-input">
                    <div className="input-container">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            rows="1"
                            disabled={sending}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || sending}
                            className="send-btn"
                            title={connected ? 'Gửi tin nhắn' : 'Gửi tin nhắn (HTTP)'}
                        >
                            {sending ? '📤' : '➤'}
                        </button>
                    </div>
                    {!connected && (
                        <div className="connection-warning">
                            ⚠️ Kết nối realtime bị gián đoạn. Tin nhắn sẽ được gửi qua HTTP.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserChat;
