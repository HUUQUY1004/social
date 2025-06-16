import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../action/action';
import './AdminComponents.css';

const AllReelsManagement = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReel, setSelectedReel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllReels();
    }, []);

    const fetchAllReels = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/reels/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReels(data);
            }
        } catch (error) {
            console.error('Error fetching reels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReel = async (reelId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa reel này?')) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${BASE_URL}/api/admin/reels/${reelId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    setReels(reels.filter(reel => reel.id !== reelId));
                    setShowModal(false);
                    alert('Đã xóa reel thành công');
                }
            } catch (error) {
                console.error('Error deleting reel:', error);
                alert('Có lỗi xảy ra khi xóa reel');
            }
        }
    };

    const handleChangeStatus = async (reelId, newStatus, reason = '') => {
        try {
            const token = localStorage.getItem('adminToken');
            const endpoint = newStatus === 'APPROVED' ? 'approve' : 'reject';
            const response = await fetch(`${BASE_URL}/api/admin/reels/${reelId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStatus === 'REJECTED' ? { reason } : {})
            });

            if (response.ok) {
                fetchAllReels(); // Refresh data
                setShowModal(false);
                alert(`Đã ${newStatus === 'APPROVED' ? 'duyệt' : 'từ chối'} reel thành công`);
            }
        } catch (error) {
            console.error('Error changing reel status:', error);
            alert('Có lỗi xảy ra khi thay đổi trạng thái reel');
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ duyệt', class: 'status-pending' };
            case 'APPROVED': return { text: 'Đã duyệt', class: 'status-approved' };
            case 'REJECTED': return { text: 'Từ chối', class: 'status-rejected' };
            default: return { text: 'Không xác định', class: 'status-unknown' };
        }
    };

    const filteredReels = reels.filter(reel => {
        const matchesStatus = filterStatus === 'ALL' || reel.status === filterStatus;
        const matchesSearch = reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             reel.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="reels-management">
            <div className="management-header">
                <h2>🎬 Quản lý tất cả Reels</h2>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-number">{reels.length}</span>
                        <span className="stat-label">Tổng Reels</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{reels.filter(r => r.status === 'PENDING').length}</span>
                        <span className="stat-label">Chờ duyệt</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{reels.filter(r => r.status === 'APPROVED').length}</span>
                        <span className="stat-label">Đã duyệt</span>
                    </div>
                </div>
            </div>

            <div className="management-controls">
                <div className="filters">
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="REJECTED">Từ chối</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm kiếm reel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button onClick={fetchAllReels} className="btn btn-info">
                    🔄 Làm mới
                </button>
            </div>

            <div className="reels-grid-management">
                {filteredReels.map(reel => {
                    const statusInfo = getStatusLabel(reel.status);
                    return (
                        <div key={reel.id} className="reel-management-card">
                            <div className="reel-thumbnail-container">
                                <video 
                                    className="reel-thumbnail-management" 
                                    muted
                                    poster={reel.thumbnail}
                                >
                                    {reel.images && reel.images.length > 0 && (
                                        <source src={reel.images[0].url} type="video/mp4" />
                                    )}
                                </video>
                                <div className="reel-overlay">
                                    <span className="reel-id">#{reel.id}</span>
                                    <span className={`status-badge ${statusInfo.class}`}>
                                        {statusInfo.text}
                                    </span>
                                </div>
                            </div>

                            <div className="reel-management-info">
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
                                
                                <p className="reel-title">{reel.title || 'Không có tiêu đề'}</p>
                                
                                <div className="reel-stats">
                                    <span className="stat-item">
                                        <span className="stat-icon">❤️</span>
                                        <span>{reel.likedByUsers?.length || 0}</span>
                                    </span>
                                    <span className="stat-item">
                                        <span className="stat-icon">💬</span>
                                        <span>{reel.comments?.length || 0}</span>
                                    </span>
                                </div>
                                
                                <div className="reel-management-actions">
                                    <button 
                                        className="btn btn-info btn-sm"
                                        onClick={() => {
                                            setSelectedReel(reel);
                                            setShowModal(true);
                                        }}
                                    >
                                        👁️ Xem
                                    </button>
                                    {reel.status === 'PENDING' && (
                                        <>
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleChangeStatus(reel.id, 'APPROVED')}
                                            >
                                                ✅ Duyệt
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    const reason = prompt('Lý do từ chối:');
                                                    if (reason) handleChangeStatus(reel.id, 'REJECTED', reason);
                                                }}
                                            >
                                                ❌ Từ chối
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteReel(reel.id)}
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredReels.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🎬</div>
                    <h3>Không có reel nào</h3>
                    <p>Không tìm thấy reel phù hợp với bộ lọc hiện tại</p>
                </div>
            )}

            {/* Modal for reel details */}
            {showModal && selectedReel && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content reel-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết Reel #{selectedReel.id}</h3>
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
                                        {selectedReel.images && selectedReel.images.length > 0 && (
                                            <source src={selectedReel.images[0].url} type="video/mp4" />
                                        )}
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
                                        
                                        <div className="reel-status-detail">
                                            <h4>Trạng thái:</h4>
                                            <span className={`status-badge ${getStatusLabel(selectedReel.status).class}`}>
                                                {getStatusLabel(selectedReel.status).text}
                                            </span>
                                            {selectedReel.moderationReason && (
                                                <p className="moderation-reason">
                                                    <strong>Lý do:</strong> {selectedReel.moderationReason}
                                                </p>
                                            )}
                                            {selectedReel.moderatedAt && (
                                                <p className="moderation-date">
                                                    <strong>Thời gian duyệt:</strong> {new Date(selectedReel.moderatedAt).toLocaleString('vi-VN')}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="reel-stats-detail">
                                            <div className="stat-item">
                                                <span className="stat-icon">❤️</span>
                                                <span>{selectedReel.likedByUsers?.length || 0} lượt thích</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-icon">💬</span>
                                                <span>{selectedReel.comments?.length || 0} bình luận</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            {selectedReel.status === 'PENDING' && (
                                <>
                                    <button 
                                        className="btn btn-success"
                                        onClick={() => handleChangeStatus(selectedReel.id, 'APPROVED')}
                                    >
                                        ✅ Duyệt Reel
                                    </button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => {
                                            const reason = prompt('Lý do từ chối:');
                                            if (reason) handleChangeStatus(selectedReel.id, 'REJECTED', reason);
                                        }}
                                    >
                                        ❌ Từ chối Reel
                                    </button>
                                </>
                            )}
                            <button 
                                className="btn btn-danger"
                                onClick={() => handleDeleteReel(selectedReel.id)}
                            >
                                🗑️ Xóa Reel
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

export default AllReelsManagement;
