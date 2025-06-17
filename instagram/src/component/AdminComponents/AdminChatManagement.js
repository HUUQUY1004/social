import React, { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '../../action/action';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './AdminChatManagement.css';

const AdminChatManagement = () => {
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);const getConfig = () => {
        const token = localStorage.getItem('access_token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };    const fetchChatUsers = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/users`, getConfig());
            // Ensure response.data is an array and filter out invalid entries
            const users = Array.isArray(response.data) ? response.data.filter(user => user && user.id) : [];
            setChatUsers(users);
        } catch (error) {
            console.error('Error fetching chat users:', error);
            setChatUsers([]); // Set empty array on error
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/unread-count`, getConfig());
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, []);    useEffect(() => {
        let client = null;        const connectWebSocket = () => {
            const socket = new SockJS(`${BASE_URL}/ws`);
            client = Stomp.over(socket);
              const token = localStorage.getItem('access_token');
            console.log('Admin raw token for WebSocket:', token);
            
            // Ensure token starts with "Bearer " if it doesn't already
            let authToken = token;
            if (token && !token.startsWith('Bearer ')) {
                authToken = `Bearer ${token}`;
            }
            
            const wsHeaders = authToken ? { 
                Authorization: authToken,
                'Content-Type': 'application/json'
            } : {};
            
            console.log('Admin WebSocket headers:', wsHeaders);

            client.connect(wsHeaders, (frame) => {
                console.log('Admin connected to WebSocket:', frame);
                setStompClient(client);
                setConnected(true);                // Subscribe to receive new messages from users
                client.subscribe('/topic/admin/messages', (message) => {
                    const chatMessage = JSON.parse(message.body);
                    console.log('Admin received message via WebSocket:', chatMessage);
                    
                    // If this is the currently selected user, add to messages
                    if (selectedUser && (chatMessage.userId === selectedUser.id || 
                        (chatMessage.user && chatMessage.user.id === selectedUser.id))) {
                        setMessages(prev => {
                            // Avoid duplicate messages by checking if message already exists
                            const exists = prev.some(msg => 
                                msg.id === chatMessage.id || 
                                (msg.isTemp && msg.message === chatMessage.message && msg.sender === chatMessage.sender)
                            );
                            
                            if (exists) {
                                // Replace temporary message with real one
                                return prev.map(msg => 
                                    msg.isTemp && msg.message === chatMessage.message && msg.sender === chatMessage.sender 
                                        ? chatMessage 
                                        : msg
                                );
                            } else {
                                return [...prev, chatMessage];
                            }
                        });
                    }
                    
                    // Update unread count
                    fetchUnreadCount();
                    
                    // Update user list
                    fetchChatUsers();                });

                // Subscribe to read status updates
                client.subscribe('/topic/admin/read/*', (message) => {
                    console.log('Message read notification:', message.body);
                    // You can update UI to show read status here
                });
            }, (error) => {
                console.error('Admin WebSocket connection error:', error);
                setConnected(false);
                
                // Try to reconnect after 3 seconds
                setTimeout(() => {
                    console.log('Attempting to reconnect Admin WebSocket...');
                    connectWebSocket();
                }, 3000);
            });

            client.onWebSocketError = (error) => {
                console.error('Admin WebSocket error:', error);
                setConnected(false);
            };
        };

        fetchChatUsers();
        fetchUnreadCount();
        connectWebSocket();
        
        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };    }, [fetchChatUsers, fetchUnreadCount, selectedUser]);

const fetchChatHistory = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/history/${userId}`, getConfig());
            // Ensure response.data.chats is an array
            const chats = Array.isArray(response.data.chats) ? response.data.chats : [];
            setMessages(chats);
            
            // Mark messages as read
            await axios.post(`${BASE_URL}/api/chat/mark-read/${userId}`, {}, getConfig());
            fetchUnreadCount(); // Refresh unread count
        } catch (error) {
            console.error('Error fetching chat history:', error);
            setMessages([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser || !selectedUser.id || sending) {
            return;
        }

        setSending(true);
        const messageText = newMessage; // Store message text outside try block
        
        try {
            setNewMessage(''); // Clear input immediately for better UX
            
            // Create temporary message for immediate UI update
            const tempMessage = {
                id: Date.now(), // Temporary ID
                message: messageText,
                sender: 'ADMIN',
                userId: selectedUser.id,
                createdAt: new Date().toISOString(),
                isTemp: true // Mark as temporary
            };
            
            // Add to UI immediately
            setMessages(prev => [...prev, tempMessage]);
            
            // Gửi qua WebSocket nếu có kết nối
            if (stompClient && connected && stompClient.connected) {
                console.log('Admin sending message via WebSocket:', messageText);
                
                stompClient.send('/app/chat.sendToUser', {}, JSON.stringify({
                    userId: selectedUser.id,
                    message: messageText
                }));
                
            } else {
                // Fallback về HTTP nếu WebSocket không khả dụng
                console.log('WebSocket not connected, using HTTP fallback');
                const response = await axios.post(
                    `${BASE_URL}/api/chat/send-to-user`,
                    {
                        userId: selectedUser.id,
                        message: messageText
                    },
                    getConfig()
                );

                // Replace temporary message with real message from server
                if (response.data.chat) {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg.isTemp && msg.message === messageText ? response.data.chat : msg
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove temporary message on error
            setMessages(prev => prev.filter(msg => !msg.isTemp || msg.message !== messageText));
            setNewMessage(messageText); // Restore message in input
            alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };const handleUserSelect = (user) => {
        if (!user || !user.id) {
            console.error('Invalid user selected:', user);
            return;
        }
        setSelectedUser(user);
        setMessages([]);
        fetchChatHistory(user.id);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };    return (
        <div className="admin-chat-management">
            <div className="management-header">
                <h2>💬 Quản lý Chat với Người dùng</h2>
                {unreadCount > 0 && (
                    <div className="unread-badge">
                        {unreadCount} tin nhắn chưa đọc
                    </div>
                )}
                <div className={`admin-connection-status ${connected ? 'online' : 'offline'}`}>
                    {connected ? '🟢 Online' : '🔴 Offline'}
                </div>
            </div>

            <div className="chat-layout">
                {/* User List */}
                <div className="chat-users-list">
                    <div className="users-header">
                        <h3>Danh sách người dùng</h3>
                        <span className="users-count">({chatUsers.length})</span>
                    </div>
                    
                    <div className="users-container">
                        {chatUsers.length === 0 ? (
                            <div className="empty-users">
                                <div className="empty-icon">👥</div>
                                <p>Chưa có người dùng nào gửi tin nhắn</p>
                            </div>                        ) : (
                            chatUsers
                                .filter(user => user && user.id) // Filter out null/undefined users
                                .map(user => (
                                <div
                                    key={user.id}
                                    className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="user-avatar">
                                        {user.avatar ? (
                                            <img src={`${BASE_URL}${user.avatar}`} alt={user.username} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {user.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.nickname || user.username}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    {selectedUser ? (
                        <>
                            <div className="chat-header">
                                <div className="selected-user-info">
                                    <div className="user-avatar-small">
                                        {selectedUser.avatar ? (
                                            <img src={`${BASE_URL}${selectedUser.avatar}`} alt={selectedUser.username} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {selectedUser.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="user-name">{selectedUser.nickname || selectedUser.username}</div>
                                        <div className="user-status">Online</div>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {loading ? (
                                    <div className="chat-loading">
                                        <div className="loading-spinner"></div>
                                        <span>Đang tải tin nhắn...</span>
                                    </div>
                                ) : (
                                    <>
                                        {messages.length === 0 ? (
                                            <div className="empty-messages">
                                                <div className="empty-icon">💬</div>
                                                <p>Chưa có tin nhắn nào</p>
                                            </div>                                        ) : (                                            messages
                                                .filter(message => message && message.id) // Filter out null/undefined messages
                                                .map((message, index) => {
                                                    console.log('Message:', message.id, 'Sender:', message.sender, 'Message:', message.message);
                                                    return (
                                                        <div
                                                            key={`${message.id}-${index}-${message.createdAt}`}
                                                            className={`message ${message.sender === 'ADMIN' ? 'admin-message' : 'user-message'}`}
                                                        >
                                                            <div className="message-content">
                                                                <p>{message.message}</p>
                                                                <span className="message-time">
                                                                    {formatTime(message.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="chat-input">
                                <div className="input-container">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn..."
                                        rows="1"
                                        disabled={sending}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim() || sending}
                                        className="send-btn"
                                    >
                                        {sending ? '📤' : '➤'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-user-selected">
                            <div className="no-selection-icon">💬</div>
                            <h3>Chọn người dùng để bắt đầu chat</h3>
                            <p>Hãy chọn một người dùng từ danh sách bên trái để xem và trả lời tin nhắn.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChatManagement;
