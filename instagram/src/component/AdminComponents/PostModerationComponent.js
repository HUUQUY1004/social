import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../action/action';
import './PostModerationComponent.css';
import './AdminComponents.css';

const PostModerationComponent = () => {
    const [pendingPosts, setPendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/posts/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingPosts(data);
            }
        } catch (error) {
            console.error('Error fetching pending posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePost = async (postId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setPendingPosts(pendingPosts.filter(post => post.id !== postId));
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error approving post:', error);
        }
    };

    const handleRejectPost = async (postId, reason) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (response.ok) {
                setPendingPosts(pendingPosts.filter(post => post.id !== postId));
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error rejecting post:', error);
        }
    };

    const openPostModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="post-moderation">
            <div className="management-header">
                <h2>⏳ Kiểm duyệt bài viết</h2>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-number">{pendingPosts.length}</span>
                        <span className="stat-label">Chờ duyệt</span>
                    </div>
                </div>
            </div>

            {pendingPosts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>Không có bài viết nào cần duyệt</h3>
                    <p>Tất cả bài viết đã được xử lý</p>
                </div>
            ) : (
                <div className="posts-grid">
                    {pendingPosts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-author">
                                    <img 
                                        src={post.user?.avatar || '/no-avatar.jpg'} 
                                        alt="Avatar"
                                        className="author-avatar"
                                    />
                                    <div className="author-info">
                                        <span className="author-name">{post.user?.username}</span>
                                        <span className="post-date">
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                                <div className="post-type">
                                    {post.video ? '🎬' : '📷'}
                                </div>
                            </div>

                            <div className="post-content">
                                <p className="post-title">{post.title}</p>
                                {post.images && post.images.length > 0 && (
                                    <div className="post-images">
                                        <img 
                                            src={post.images[0]} 
                                            alt="Post content"
                                            className="post-image"
                                        />
                                        {post.images.length > 1 && (
                                            <div className="image-count">
                                                +{post.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {post.video && (
                                    <div className="post-video">
                                        <video className="video-thumbnail" muted>
                                            <source src={post.video} type="video/mp4" />
                                        </video>
                                    </div>
                                )}
                            </div>

                            <div className="post-actions">
                                <button 
                                    className="btn btn-info"
                                    onClick={() => openPostModal(post)}
                                >
                                    👁️ Xem chi tiết
                                </button>
                                <button 
                                    className="btn btn-success"
                                    onClick={() => handleApprovePost(post.id)}
                                >
                                    ✅ Duyệt
                                </button>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => {
                                        const reason = prompt('Lý do từ chối:');
                                        if (reason) handleRejectPost(post.id, reason);
                                    }}
                                >
                                    ❌ Từ chối
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for post details */}
            {showModal && selectedPost && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết bài viết</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="post-detail">
                                <div className="post-author-detail">
                                    <img 
                                        src={selectedPost.user?.avatar || '/no-avatar.jpg'} 
                                        alt="Avatar"
                                        className="author-avatar-large"
                                    />
                                    <div>
                                        <h4>{selectedPost.user?.username}</h4>
                                        <p>{selectedPost.user?.email}</p>
                                        <p>Ngày đăng: {new Date(selectedPost.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                                
                                <div className="post-content-detail">
                                    <h4>Nội dung:</h4>
                                    <p>{selectedPost.title}</p>
                                    
                                    {selectedPost.images && selectedPost.images.length > 0 && (
                                        <div className="post-images-detail">
                                            <h4>Hình ảnh:</h4>
                                            <div className="images-grid">
                                                {selectedPost.images.map((image, index) => (                                                    <img 
                                                        key={index}
                                                        src={image} 
                                                        alt={`Post content ${index + 1}`}
                                                        className="detail-image"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedPost.video && (
                                        <div className="post-video-detail">
                                            <h4>Video:</h4>
                                            <video controls className="detail-video">
                                                <source src={selectedPost.video} type="video/mp4" />
                                            </video>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn btn-success"
                                onClick={() => handleApprovePost(selectedPost.id)}
                            >
                                ✅ Duyệt bài viết
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={() => {
                                    const reason = prompt('Lý do từ chối:');
                                    if (reason) handleRejectPost(selectedPost.id, reason);
                                }}
                            >
                                ❌ Từ chối bài viết
                            </button>
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostModerationComponent;
