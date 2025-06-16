import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ onMenuClick, activeMenu }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            id: 'dashboard',
            icon: '📊',
            label: 'Tổng quan',
            path: '/admin/dashboard'
        },
        {
            id: 'users',
            icon: '👥',
            label: 'Quản lý người dùng',
            path: '/admin/users'
        },
        {
            id: 'posts',
            icon: '📝',
            label: 'Quản lý bài viết',
            path: '/admin/posts'
        },
        {
            id: 'reels',
            icon: '🎬',
            label: 'Quản lý Reels',
            path: '/admin/reels'
        },
        {
            id: 'pending-posts',
            icon: '⏳',
            label: 'Kiểm duyệt bài viết',
            path: '/admin/pending-posts',
            badge: true
        },        {
            id: 'pending-reels',
            icon: '⏰',
            label: 'Kiểm duyệt Reels',
            path: '/admin/pending-reels',
            badge: true
        },
        {
            id: 'chat',
            icon: '💬',
            label: 'Quản lý Chat',
            path: '/admin/chat'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        navigate('/admin/login');
    };

    const handleMenuClick = (item) => {
        onMenuClick(item.id);
        // Có thể navigate nếu cần
        // navigate(item.path);
    };

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-logo">
                    <span className="logo-icon">🔐</span>
                    <span className="logo-text">Admin Panel</span>
                </div>
                <div className="admin-user-info">
                    <span className="admin-name">Quản trị viên</span>
                    <span className="admin-role">Administrator</span>
                </div>
            </div>

            <nav className="admin-sidebar-nav">
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                        onClick={() => handleMenuClick(item)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        {item.badge && (
                            <span className="nav-badge">
                                <span className="badge-dot"></span>
                            </span>
                        )}
                    </div>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <div className="nav-item logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    <span className="nav-label">Đăng xuất</span>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
