# The Gathering - Backend System

Hệ thống Backend cho dự án "The Gathering", được xây dựng với mục tiêu cung cấp nền tảng quản lý tài nguyên và người dùng mạnh mẽ, bảo mật.

## 🚀 Công nghệ sử dụng

- **Node.js & Express**: Framework server chính.
- **PostgreSQL**: Cơ sở dữ liệu quan hệ.
- **JWT (JSON Web Token)**: Xác thực phiên làm việc.
- **bcryptjs**: Mã hóa mật khẩu bảo mật.
- **Dotenv**: Quản lý biến môi trường.

## 📂 Cấu trúc thư mục

```text
backend/
├── migrations/          # Các file SQL để khởi tạo/cập nhật DB
├── src/
│   ├── Auth/           # Hệ thống đăng ký, đăng nhập, JWT, RBAC
│   ├── Users/          # Quản lý người dùng (Admin CRUD)
│   ├── db.js           # Cấu hình kết nối PostgreSQL (Pool)
│   ├── migrate.js      # Script chạy migrations tự động
│   └── server.js       # Entry point của ứng dụng
├── .env                # Cấu hình môi trường (DB, JWT, Port)
├── API_DOCS.md         # Danh sách chi tiết các API
└── README.md           # Hướng dẫn này
```

## 🛠 Cài đặt & Chạy dưới local

### 1. Cấu hình môi trường

Tạo file `.env` (nếu chưa có)

### 2. Cài đặt thư viện

```bash
pnpm install
```

### 3. Khởi tạo Database (Migrations)

Chạy lệnh sau để tạo các bảng cần thiết và tài khoản Admin mặc định:

```bash
node src/migrate.js
```

### 4. Chạy Server

```bash
pnpm dev
```

Server sẽ mặc định chạy tại: `http://localhost:5000`

## 🔐 Các tính năng chính

- **Xác thực**: Đăng ký, Đăng nhập và Profile (`/me`).
- **Phân quyền (RBAC)**: Hỗ trợ các role `user`, `admin`, `moderator`.
- **Quản lý Admin**: Các API CRUD người dùng được bảo vệ, chỉ cho phép Admin truy cập.
- **Validation**: Kiểm tra dữ liệu đầu vào cho các API quan trọng.

## 📖 Tài liệu API

Xem chi tiết tại [API_DOCS.md](./API_DOCS.md).
