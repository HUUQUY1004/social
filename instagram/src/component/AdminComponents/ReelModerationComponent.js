import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../action/action';
import './PostModerationComponent.css'; // Reuse post moderation styles
import './AdminComponents.css';

const ReelModerationComponent = () => {
    const [pendingReels, setPendingReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReel, setSelectedReel] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPendingReels();
    }, []);

    const fetchPendingReels = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/reels/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingReels(data);
            }
        } catch (error) {
            console.error('Error fetching pending reels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReel = async (reelId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/reels/${reelId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setPendingReels(pendingReels.filter(reel => reel.id !== reelId));
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error approving reel:', error);
        }
    };

    const handleRejectReel = async (reelId, reason) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/reels/${reelId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (response.ok) {
                setPendingReels(pendingReels.filter(reel => reel.id !== reelId));
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error rejecting reel:', error);
        }
    };

    const openReelModal = (reel) => {
        setSelectedReel(reel);
        setShowModal(true);
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="reel-moderation">
            <div className="management-header">
                <h2>⏰ Kiểm duyệt Reels</h2>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-number">{pendingReels.length}</span>
                        <span className="stat-label">Reels chờ duyệt</span>
                    </div>
                </div>
            </div>

            {pendingReels.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🎬</div>
                    <h3>Không có Reels nào cần duyệt</h3>
                    <p>Tất cả Reels đã được xử lý</p>
                </div>
            ) : (
                <div className="reels-grid">
                    {pendingReels.map(reel => (
                        <div key={reel.id} className="reel-card">
                            <div className="reel-video">
                                <video 
                                    className="reel-thumbnail" 
                                    muted
                                    poster={reel.thumbnail}
                                >
                                    <source src={reel.video} type="video/mp4" />
                                </video>
                                <div className="reel-duration">
                                    {reel.duration || '0:00'}
                                </div>
                            </div>

                            <div className="reel-info">
                                <div className="reel-author">
                                    <img 
                                        src={reel.user?.avatar || '/no-avatar.jpg'} 
                                        alt="Avatar"
                                        className="author-avatar-small"
                                    />
                                    <div>
                                        <span className="author-name">{reel.user?.username}</span>
                                        <span className="reel-date">
                                            {new Date(reel.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="reel-title">{reel.title}</p>
                                
                                <div className="reel-actions">
                                    <button 
                                        className="btn btn-info btn-sm"
                                        onClick={() => openReelModal(reel)}
                                    >
                                        👁️ Xem
                                    </button>
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApproveReel(reel.id)}
                                    >
                                        ✅ Duyệt
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                            const reason = prompt('Lý do từ chối:');
                                            if (reason) handleRejectReel(reel.id, reason);
                                        }}
                                    >
                                        ❌ Từ chối
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for reel details */}
            {showModal && selectedReel && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content reel-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết Reel</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="reel-detail">
                                <div className="reel-video-container">
                                    <video 
                                        controls 
                                        className="reel-video-full"
                                        autoPlay
                                        muted
                                    >
                                        <source src={selectedReel.video} type="video/mp4" />
                                    </video>
                                </div>
                                
                                <div className="reel-info-detail">
                                    <div className="reel-author-detail">
                                        <img 
                                            src={selectedReel.user?.avatar || '/no-avatar.jpg'} 
                                            alt="Avatar"
                                            className="author-avatar-large"
                                        />
                                        <div>
                                            <h4>{selectedReel.user?.username}</h4>
                                            <p>{selectedReel.user?.email}</p>
                                            <p>Ngày đăng: {new Date(selectedReel.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="reel-content-detail">
                                        <h4>Nội dung:</h4>
                                        <p>{selectedReel.title}</p>
                                        
                                        <div className="reel-stats">
                                            <div className="stat-item">
                                                <span className="stat-icon">👁️</span>
                                                <span>{selectedReel.views || 0} lượt xem</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-icon">❤️</span>
                                                <span>{selectedReel.likes || 0} lượt thích</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-icon">💬</span>
                                                <span>{selectedReel.comments || 0} bình luận</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn btn-success"
                                onClick={() => handleApproveReel(selectedReel.id)}
                            >
                                ✅ Duyệt Reel
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={() => {
                                    const reason = prompt('Lý do từ chối:');
                                    if (reason) handleRejectReel(selectedReel.id, reason);
                                }}
                            >
                                ❌ Từ chối Reel
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

export default ReelModerationComponent;
