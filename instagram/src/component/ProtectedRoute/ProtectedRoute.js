import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Kiểm tra xem có token không
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Kiểm tra quyền admin nếu cần
    if (requiredRole === 'ADMIN') {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken || userRole !== 'ADMIN') {
            return <Navigate to="/admin/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
