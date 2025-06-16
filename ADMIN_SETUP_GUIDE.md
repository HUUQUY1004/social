# Hướng dẫn triển khai tính năng Admin

## 🔧 Backend (Spring Boot)

### 1. Database Migration
Chạy script SQL để tạo tài khoản admin mặc định:
```sql
-- File: src/main/resources/sql/create_admin.sql
-- Tài khoản: admin@social.com
-- Mật khẩu: admin123
```

### 2. Các endpoint Admin mới
```
POST /auth/admin/login - Đăng nhập admin
GET /api/admin/dashboard - Trang dashboard admin
GET /api/admin/users - Lấy danh sách tất cả người dùng
GET /api/admin/users/{id} - Lấy thông tin người dùng theo ID
PUT /api/admin/users/{id}/role?role=ADMIN|USER - Cập nhật quyền người dùng
DELETE /api/admin/users/{id} - Xóa người dùng
```

### 3. Bảo mật
- Tất cả endpoint `/api/admin/**` yêu cầu quyền ADMIN
- JWT token phải chứa role ADMIN
- AdminAuthFilter kiểm tra quyền trước khi truy cập

## 🎨 Frontend (React)

### 1. Trang Admin mới
- `/admin/login` - Trang đăng nhập admin
- `/admin/dashboard` - Trang quản trị với thống kê và quản lý user

### 2. Tính năng
- Đăng nhập riêng cho admin
- Xem thống kê tổng quan
- Quản lý danh sách người dùng
- Cập nhật quyền user/admin
- Xóa người dùng (không thể xóa admin)
- Bảo vệ route với ProtectedRoute component

### 3. Bảo mật Frontend
- Kiểm tra token và role trước khi truy cập
- Tự động redirect về login nếu không có quyền
- Lưu token riêng cho admin

## 🚀 Cách sử dụng

### 1. Khởi động Backend
```bash
cd Social/Social
mvn spring-boot:run
```

### 2. Khởi động Frontend
```bash
cd instagram
npm start
```

### 3. Truy cập trang Admin
- Mở trình duyệt: `http://localhost:3000/admin/login`
- Đăng nhập với:
  - Email: `admin@social.com`
  - Mật khẩu: `admin123`

### 4. Tạo Admin mới
1. Đăng nhập với tài khoản admin
2. Vào dashboard admin
3. Tìm user cần cấp quyền admin
4. Click "Sửa quyền" và chọn "Đặt làm Admin"

## 📋 Checklist triển khai

### Backend
- [✓] Tạo enum Role (USER, ADMIN)
- [✓] Cập nhật User model thêm field role
- [✓] Cập nhật CustomerUserDetailsService xử lý authorities
- [✓] Tạo AdminController với các endpoint quản lý
- [✓] Cập nhật UserService thêm methods cho admin
- [✓] Thêm admin login endpoint trong AuthController
- [✓] Tạo AdminAuthFilter kiểm tra quyền
- [✓] Cập nhật AppConfig thêm method security
- [✓] Tạo script SQL tạo admin mặc định

### Frontend
- [✓] Tạo AdminLogin component
- [✓] Tạo AdminDashboard component
- [✓] Tạo ProtectedRoute component
- [✓] Cập nhật router thêm admin routes
- [✓] Styling responsive cho trang admin

## 🔐 Bảo mật

### 1. Backend Security
- Method-level security với @PreAuthorize
- JWT token validation
- Role-based access control
- Admin-specific filter chain

### 2. Frontend Security
- Protected routes
- Token validation
- Role checking
- Automatic logout on unauthorized

## 🎯 Tính năng nâng cao có thể thêm

1. **Thống kê nâng cao**: Biểu đồ, báo cáo
2. **Quản lý bài viết**: Duyệt, xóa bài viết
3. **Quản lý báo cáo**: Xử lý báo cáo từ user
4. **Logs hệ thống**: Theo dõi hoạt động
5. **Backup/Restore**: Sao lưu dữ liệu
6. **Email notifications**: Thông báo cho admin
7. **Multi-language**: Hỗ trợ đa ngôn ngữ

## ❗ Lưu ý quan trọng

1. **Đổi mật khẩu admin mặc định** sau khi triển khai
2. **Backup database** trước khi cập nhật
3. **Test thoroughly** trước khi deploy production
4. **Monitor logs** để phát hiện truy cập trái phép
5. **Cập nhật dependencies** thường xuyên cho bảo mật
