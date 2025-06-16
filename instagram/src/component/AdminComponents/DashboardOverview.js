import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../action/action';
import './AdminComponents.css';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalPosts: 0,
        totalReels: 0,
        pendingPosts: 0,
        pendingReels: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

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
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="dashboard-overview">
            <div className="management-header">
                <h2>📊 Tổng quan hệ thống</h2>
            </div>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.totalUsers}</div>
                        <div className="stat-label">Tổng người dùng</div>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.activeUsers}</div>
                        <div className="stat-label">Người dùng hoạt động</div>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.totalPosts}</div>
                        <div className="stat-label">Tổng bài viết</div>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">🎬</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.totalReels}</div>
                        <div className="stat-label">Tổng Reels</div>
                    </div>
                </div>

                <div className="stat-card danger">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.pendingPosts}</div>
                        <div className="stat-label">Bài viết chờ duyệt</div>
                    </div>
                </div>

                <div className="stat-card secondary">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.pendingReels}</div>
                        <div className="stat-label">Reels chờ duyệt</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Thống kê nhanh</h3>
                    <div className="progress-bars">
                        <div className="progress-item">
                            <div className="progress-label">
                                <span>Người dùng hoạt động</span>
                                <span>{Math.round((stats.activeUsers / stats.totalUsers) * 100)}%</span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill success"
                                    style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-label">
                                <span>Bài viết cần duyệt</span>
                                <span>{stats.totalPosts > 0 ? Math.round((stats.pendingPosts / stats.totalPosts) * 100) : 0}%</span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill danger"
                                    style={{ width: `${stats.totalPosts > 0 ? (stats.pendingPosts / stats.totalPosts) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-label">
                                <span>Reels cần duyệt</span>
                                <span>{stats.totalReels > 0 ? Math.round((stats.pendingReels / stats.totalReels) * 100) : 0}%</span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill warning"
                                    style={{ width: `${stats.totalReels > 0 ? (stats.pendingReels / stats.totalReels) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h3>Hành động nhanh</h3>
                    <div className="action-buttons">
                        <button className="action-btn primary">
                            <span className="action-icon">👥</span>
                            <span>Quản lý người dùng</span>
                        </button>
                        <button className="action-btn danger">
                            <span className="action-icon">⏳</span>
                            <span>Duyệt bài viết</span>
                        </button>
                        <button className="action-btn warning">
                            <span className="action-icon">⏰</span>
                            <span>Duyệt Reels</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
