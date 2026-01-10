# Services Architecture Guide

/http

- Chứa http client (fetch/axios wrapper)
- Không chứa business
- Dùng chung cho internal/external

/internal

- Gọi backend của hệ thống
- Có thể gọi từ client hoặc server

/external

- Gọi backend của bên thứ 3 (partner)
- Chỉ gọi từ server hoặc API route (tránh lộ secret)
