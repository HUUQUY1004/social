-- Script để tạo tài khoản admin mặc định
-- Mật khẩu: 123456 (đã được mã hóa bằng BCrypt)

INSERT INTO users (id, email, username, nickname, password, role, description, avatar, banner, stringee_id) 
VALUES (
    1, 
    'admin@social.com',
    'admin', 
    'Administrator', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'ADMIN',
    'Quản trị viên hệ thống',
    null,
    null,
    'admin-stringee-id'
) ON DUPLICATE KEY UPDATE 
    role = 'ADMIN',
    email = 'admin@social.com';
