import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../action/action';
import AdminSidebar from '../../component/AdminSidebar/AdminSidebar';
import UserManagement from '../../component/AdminComponents/UserManagement';
import PostModerationComponent from '../../component/AdminComponents/PostModerationComponent';
import ReelModerationComponent from '../../component/AdminComponents/ReelModerationComponent';
import AllPostsManagement from '../../component/AdminComponents/AllPostsManagement';
import AllReelsManagement from '../../component/AdminComponents/AllReelsManagement';
import DashboardOverview from '../../component/AdminComponents/DashboardOverview';
import AdminChatManagement from '../../component/AdminComponents/AdminChatManagement';
import '../../component/AdminComponents/AdminComponents.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const navigate = useNavigate();useEffect(() => {
        // Kiểm tra quyền admin
        const token = localStorage.getItem('adminToken');
        const role = localStorage.getItem('userRole');
        
        if (!token || role !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }        const fetchStats = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Data được xử lý trong DashboardOverview component
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

        fetchStats();
    }, [navigate]);

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
    };    const renderMainContent = () => {
        switch (activeMenu) {
            case 'users':
                return <UserManagement />;
            case 'pending-posts':
                return <PostModerationComponent />;
            case 'pending-reels':
                return <ReelModerationComponent />;
            case 'posts':
                return <AllPostsManagement />;
            case 'reels':
                return <AllReelsManagement />;
            case 'chat':
                return <AdminChatManagement />;
            case 'reports':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            case 'analytics':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            case 'settings':
                return <div className="coming-soon">🚧 Chức năng đang phát triển</div>;
            default:
                return <DashboardOverview />;
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
export default AdminDashboard;
