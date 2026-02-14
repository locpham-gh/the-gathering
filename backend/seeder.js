import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from './models/Resource.js';
import connectDB from './config/db.js';

dotenv.config();

const resources = [
    {
        title: "Hướng dẫn lập trình React 2026",
        author: "Lộc Nguyễn",
        thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        format: "pdf",
        content_type: "guide",
        description: "Tài liệu toàn tập về React 19 và các công nghệ mới nhất.",
        tags: ["react", "frontend", "2026"]
    },
    {
        title: "Thiết kế UI/UX theo phong cách Glassmorphism",
        author: "Thảo Vy",
        thumbnail_url: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80",
        file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        format: "pdf",
        content_type: "ebook",
        description: "Tìm hiểu xu hướng thiết kế giao diện hiện đại.",
        tags: ["ui", "ux", "design"]
    },
    {
        title: "Khóa học Master Tailwind CSS",
        author: "Hoàng Long",
        thumbnail_url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
        file_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        format: "mp4",
        content_type: "course",
        description: "Làm chủ Tailwind CSS trong 7 ngày.",
        tags: ["tailwind", "css", "frontend"]
    },
    {
        title: "Clean Code: Nghệ thuật viết mã sạch",
        author: "Robert C. Martin",
        thumbnail_url: "https://images.unsplash.com/photo-1532012197367-bf8541b1683d?w=800&q=80",
        file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        format: "pdf",
        content_type: "ebook",
        description: "Cuốn sách kinh điển về lập trình sạch.",
        tags: ["clean code", "best practices"]
    },
    {
        title: "Xây dựng Backend với Node.js & PostgreSQL",
        author: "Minh Anh",
        thumbnail_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        file_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        format: "mp4",
        content_type: "course",
        description: "Khóa học xây dựng hệ thống backend hiệu năng cao.",
        tags: ["node.js", "postgresql", "backend"]
    }
];

const seedResources = async () => {
    try {
        await connectDB();

        // Clear existing resources
        await Resource.deleteMany();
        console.log('Existing resources removed');

        // Insert new resources
        await Resource.insertMany(resources);
        console.log('Resources seeded successfully');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedResources();
