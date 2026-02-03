-- Seed some descriptive rooms
INSERT INTO rooms (code, title, is_active) VALUES 
('gen-001', 'Cộng Đồng Chung', true),
('tech-002', 'Thảo Luận Công Nghệ', true),
('help-003', 'Hỗ Trợ Thành Viên', true)
ON CONFLICT (code) DO NOTHING;
