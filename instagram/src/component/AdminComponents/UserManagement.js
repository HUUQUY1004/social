import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../action/action';
import './UserManagement.css';
import './AdminComponents.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/block`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/unblock`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    // Filter users based on search term and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="user-management">
            <div className="management-header">
                <h2>👥 Quản lý người dùng</h2>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Tổng người dùng</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.role === 'ADMIN').length}</span>
                        <span className="stat-label">Quản trị viên</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.blocked).length}</span>
                        <span className="stat-label">Đã khóa</span>
                    </div>
                </div>
            </div>

            <div className="management-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="USER">Người dùng</option>
                        <option value="ADMIN">Quản trị viên</option>
                    </select>
                </div>
            </div>

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Tên người dùng</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Ngày tham gia</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <img 
                                        src={user.avatar || '/no-avatar.jpg'} 
                                        alt="Avatar"
                                        className="user-avatar"
                                    />
                                </td>
                                <td className="username-cell">
                                    <span className="username">{user.username}</span>
                                    <span className="user-id">ID: {user.id}</span>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                        {user.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                                        {user.blocked ? '🚫 Đã khóa' : '✅ Hoạt động'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="action-buttons">
                                        {user.role !== 'ADMIN' && (
                                            <>
                                                {user.blocked ? (
                                                    <button 
                                                        className="btn btn-success"
                                                        onClick={() => handleUnblockUser(user.id)}
                                                    >
                                                        🔓 Mở khóa
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="btn btn-danger"
                                                        onClick={() => handleBlockUser(user.id)}
                                                    >
                                                        🔒 Khóa
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <button className="btn btn-info">
                                            👁️ Xem chi tiết
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-outline"
                >
                    ← Trước
                </button>
                <span className="page-info">
                    Trang {currentPage} / {totalPages}
                </span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline"
                >
                    Sau →
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
