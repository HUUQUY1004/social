import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../action/action';
import './AdminComponents.css';

const AllPostsManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/posts/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    setPosts(posts.filter(post => post.id !== postId));
                    setShowModal(false);
                    alert('Đã xóa bài viết thành công');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Có lỗi xảy ra khi xóa bài viết');
            }
        }
    };

    const handleChangeStatus = async (postId, newStatus, reason = '') => {
        try {
            const token = localStorage.getItem('adminToken');
            const endpoint = newStatus === 'APPROVED' ? 'approve' : 'reject';
            const response = await fetch(`${BASE_URL}/api/admin/posts/${postId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStatus === 'REJECTED' ? { reason } : {})
            });

            if (response.ok) {
                fetchAllPosts(); // Refresh data
                setShowModal(false);
                alert(`Đã ${newStatus === 'APPROVED' ? 'duyệt' : 'từ chối'} bài viết thành công`);
            }
        } catch (error) {
            console.error('Error changing post status:', error);
            alert('Có lỗi xảy ra khi thay đổi trạng thái bài viết');
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

    const filteredPosts = posts.filter(post => {
        const matchesStatus = filterStatus === 'ALL' || post.status === filterStatus;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             post.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="posts-management">
            <div className="management-header">
                <h2>📝 Quản lý tất cả bài viết</h2>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-number">{posts.length}</span>
                        <span className="stat-label">Tổng bài viết</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{posts.filter(p => p.status === 'PENDING').length}</span>
                        <span className="stat-label">Chờ duyệt</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{posts.filter(p => p.status === 'APPROVED').length}</span>
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
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button onClick={fetchAllPosts} className="btn btn-info">
                    🔄 Làm mới
                </button>
            </div>

            <div className="posts-table-container">
                <table className="posts-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Lượt thích</th>
                            <th>Bình luận</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map(post => {
                            const statusInfo = getStatusLabel(post.status);
                            return (
                                <tr key={post.id}>
                                    <td>#{post.id}</td>
                                    <td className="post-title">
                                        <div className="title-content">
                                            {post.title || 'Không có tiêu đề'}
                                            {post.images && post.images.length > 0 && (
                                                <span className="media-indicator">📷 {post.images.length}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="author-info">
                                            <img 
                                                src={post.user?.avatar || '/no-avatar.jpg'} 
                                                alt="Avatar"
                                                className="author-avatar-tiny"
                                            />
                                            <span>{post.user?.username}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <span className={`status-badge ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="stat-value">
                                            ❤️ {post.likedByUsers?.length || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="stat-value">
                                            💬 {post.comments?.length || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => {
                                                    setSelectedPost(post);
                                                    setShowModal(true);
                                                }}
                                                className="btn btn-sm btn-info"
                                            >
                                                👁️ Xem
                                            </button>
                                            {post.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleChangeStatus(post.id, 'APPROVED')}
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        ✅ Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt('Lý do từ chối:');
                                                            if (reason) handleChangeStatus(post.id, 'REJECTED', reason);
                                                        }}
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        ❌ Từ chối
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredPosts.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>Không có bài viết nào</h3>
                    <p>Không tìm thấy bài viết phù hợp với bộ lọc hiện tại</p>
                </div>
            )}

            {/* Modal for post details */}
            {showModal && selectedPost && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết bài viết #{selectedPost.id}</h3>
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
                                    
                                    <div className="post-status-detail">
                                        <h4>Trạng thái:</h4>
                                        <span className={`status-badge ${getStatusLabel(selectedPost.status).class}`}>
                                            {getStatusLabel(selectedPost.status).text}
                                        </span>
                                        {selectedPost.moderationReason && (
                                            <p className="moderation-reason">
                                                <strong>Lý do:</strong> {selectedPost.moderationReason}
                                            </p>
                                        )}
                                        {selectedPost.moderatedAt && (
                                            <p className="moderation-date">
                                                <strong>Thời gian duyệt:</strong> {new Date(selectedPost.moderatedAt).toLocaleString('vi-VN')}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {selectedPost.images && selectedPost.images.length > 0 && (
                                        <div className="post-images-detail">
                                            <h4>Hình ảnh:</h4>
                                            <div className="images-grid">
                                                {selectedPost.images.map((image, index) => (
                                                    <img 
                                                        key={index}
                                                        src={image.url} 
                                                        alt={`Post content ${index + 1}`}
                                                        className="detail-image"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="post-stats-detail">
                                        <div className="stat-item">
                                            <span className="stat-icon">❤️</span>
                                            <span>{selectedPost.likedByUsers?.length || 0} lượt thích</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-icon">💬</span>
                                            <span>{selectedPost.comments?.length || 0} bình luận</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            {selectedPost.status === 'PENDING' && (
                                <>
                                    <button 
                                        className="btn btn-success"
                                        onClick={() => handleChangeStatus(selectedPost.id, 'APPROVED')}
                                    >
                                        ✅ Duyệt bài viết
                                    </button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => {
                                            const reason = prompt('Lý do từ chối:');
                                            if (reason) handleChangeStatus(selectedPost.id, 'REJECTED', reason);
                                        }}
                                    >
                                        ❌ Từ chối bài viết
                                    </button>
                                </>
                            )}
                            <button 
                                className="btn btn-danger"
                                onClick={() => handleDeletePost(selectedPost.id)}
                            >
                                🗑️ Xóa bài viết
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

export default AllPostsManagement;
