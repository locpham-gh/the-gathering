# API Documentation - The Gathering

Tài liệu tổng hợp các API endpoint của hệ thống Backend.

## Base URL

`http://localhost:5000` (Mặc định)

---

## 1. Hệ thống & Sức khỏe (Public)

| Method | Endpoint      | Description                                       |
| :----- | :------------ | :------------------------------------------------ |
| `GET`  | `/`           | Kiểm tra server có đang chạy hay không.           |
| `GET`  | `/api/health` | Kiểm tra kết nối Database và trạng thái hệ thống. |

---

## 2. Xác thực (Authentication)

| Method | Endpoint             | Auth   | Description                                              |
| :----- | :------------------- | :----- | :------------------------------------------------------- |
| `POST` | `/api/auth/register` | Public | Đăng ký tài khoản mới (`username`, `email`, `password`). |
| `POST` | `/api/auth/login`    | Public | Đăng nhập để lấy JWT Token (`email`, `password`).        |
| `GET`  | `/api/auth/me`       | JWT    | Lấy thông tin chi tiết của người dùng hiện tại.          |
| `POST` | `/api/auth/logout`   | JWT    | Đăng xuất người dùng.                                    |

---

## 3. Quản lý người dùng (Admin Only)

| Method   | Endpoint         | Auth  | Description                                    |
| :------- | :--------------- | :---- | :--------------------------------------------- |
| `GET`    | `/api/users`     | Admin | Lấy danh sách tất cả người dùng.               |
| `GET`    | `/api/users/:id` | Admin | Lấy thông tin chi tiết một người dùng theo ID. |
| `PUT`    | `/api/users/:id` | Admin | Cập nhật thông tin/quyền hạn của người dùng.   |
| `DELETE` | `/api/users/:id` | Admin | Xóa tài khoản người dùng khỏi hệ thống.        |

---

## Ghi chú về Authentication

- Tất cả các API yêu cầu **JWT** phải gửi token qua Header:
  `Authorization: Bearer <your_token>`
- Role mặc định khi đăng ký là `user`.
- Chỉ người dùng có role `admin` mới có quyền truy cập các API trong mục **Quản lý người dùng**.
