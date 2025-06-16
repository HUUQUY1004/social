import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../action/action';
import './AdminLogin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');        try {
            const response = await fetch(`${BASE_URL}/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });            if (response.ok) {
                const data = await response.json();
                console.log('Admin login response:', data);
                
                // Lưu token để có thể truy cập API
                if (data.jwt) {
                    localStorage.setItem('access_token', data.jwt);
                    localStorage.setItem('adminToken', data.jwt);
                    localStorage.setItem('userRole', 'ADMIN');
                    localStorage.setItem('adminInfo', JSON.stringify(data));
                    navigate('/admin/dashboard');
                } else {
                    setError('Không nhận được token từ server');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(`Lỗi kết nối server: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2>🔐 Đăng nhập Quản trị viên</h2>
                    <p>Chỉ dành cho người quản trị hệ thống</p>
                </div>
                
                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@social.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu quản trị"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>⚠️ Trang này chỉ dành cho quản trị viên được ủy quyền</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
