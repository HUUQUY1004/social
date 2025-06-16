import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../action/action';
import AdminSidebar from '../../component/AdminSidebar/AdminSidebar';
import UserManagement from '../../component/AdminComponents/UserManagement';
import PostModerationComponent from '../../component/AdminComponents/PostModerationComponent';
import ReelModerationComponent from '../../component/AdminComponents/ReelModerationComponent';
import '../../component/AdminComponents/AdminComponents.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        pendingPosts: 0,
        pendingReels: 0,
        totalReels: 0,
        activeUsers: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra quyền admin
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('userRole');
        
        if (!token || role !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }

        fetchDashboardStats();
    }, [navigate]);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else if (response.status === 403) {
                alert('Bạn không có quyền truy cập');
                navigate('/admin/login');
            } else {
                setError('Không thể tải thống kê dashboard');
            }
        } catch (error) {
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
    };

    const renderMainContent = () => {
        switch (activeMenu) {
            case 'users':
                return <UserManagement />;
            case 'pending-posts':
                return <PostModerationComponent />;
            case 'pending-reels':
                return <ReelModerationComponent />;
            case 'posts':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            case 'reels':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            case 'reports':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            case 'analytics':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            case 'settings':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            default:
                return <DashboardOverview stats={stats} />;
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <div className="error-icon">⚠️</div>
                <h3>Có lỗi xảy ra</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-info">
                    🔄 Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <AdminSidebar onMenuClick={handleMenuClick} activeMenu={activeMenu} />
            <div className="admin-main-content">
                {renderMainContent()}
            </div>
        </div>
    );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats }) => {
    return (
        <div className="dashboard-overview">
            <div className="dashboard-header">
                <h1>📊 Tổng quan hệ thống</h1>
                <p>Chào mừng bạn đến với bảng điều khiển quản trị</p>
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Tổng người dùng</p>
                        <span className="stat-change">+{stats.activeUsers} hoạt động</span>
                    </div>
                </div>

                <div className="dashboard-stat-card posts">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                        <h3>{stats.totalPosts}</h3>
                        <p>Tổng bài viết</p>
                        <span className="stat-change">{stats.pendingPosts} chờ duyệt</span>
                    </div>
                </div>

                <div className="dashboard-stat-card reels">
                    <div className="stat-icon">🎬</div>
                    <div className="stat-info">
                        <h3>{stats.totalReels}</h3>
                        <p>Tổng Reels</p>
                        <span className="stat-change">{stats.pendingReels} chờ duyệt</span>
                    </div>
                </div>

                <div className="dashboard-stat-card moderation">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pendingPosts + stats.pendingReels}</h3>
                        <p>Cần kiểm duyệt</p>
                        <span className="stat-change urgent">Cần xử lý</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-actions">
                <div className="quick-action-card">
                    <h3>🚀 Hành động nhanh</h3>
                    <div className="action-buttons">
                        <button className="action-btn users-btn">
                            <span className="action-icon">👥</span>
                            <span>Quản lý người dùng</span>
                        </button>
                        <button className="action-btn moderation-btn">
                            <span className="action-icon">⏳</span>
                            <span>Kiểm duyệt nội dung</span>
                        </button>
                        <button className="action-btn reports-btn">
                            <span className="action-icon">⚠️</span>
                            <span>Xem báo cáo</span>
                        </button>
                        <button className="action-btn analytics-btn">
                            <span className="action-icon">📈</span>
                            <span>Thống kê chi tiết</span>
                        </button>
                    </div>
                </div>

                <div className="system-info-card">
                    <h3>ℹ️ Thông tin hệ thống</h3>
                    <div className="system-status">
                        <div className="status-item">
                            <span className="status-indicator online"></span>
                            <span>Hệ thống hoạt động bình thường</span>
                        </div>
                        <div className="status-item">
                            <span className="status-indicator online"></span>
                            <span>Database kết nối ổn định</span>
                        </div>
                        <div className="status-item">
                            <span className="status-indicator warning"></span>
                            <span>Có {stats.pendingPosts + stats.pendingReels} nội dung cần duyệt</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recent-activities">
                <h3>📋 Hoạt động gần đây</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-icon">👤</span>
                        <span className="activity-text">5 người dùng mới đăng ký hôm nay</span>
                        <span className="activity-time">2 giờ trước</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">📝</span>
                        <span className="activity-text">12 bài viết mới được đăng</span>
                        <span className="activity-time">4 giờ trước</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">🎬</span>
                        <span className="activity-text">3 Reels mới cần kiểm duyệt</span>
                        <span className="activity-time">6 giờ trước</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
