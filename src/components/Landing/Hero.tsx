import { motion } from "framer-motion";
import { ArrowRight, Book, Sparkles, Users } from "lucide-react";

interface HeroProps {
  onJoinClick: () => void;
}

export default function Hero({ onJoinClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden bg-slate-50">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-teal-300">
          <Sparkles size={16} />
          <span>New platform for the community</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Virtual Co-Working Space <br />
          <span className="bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent italic">
            Gather Together
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate platform to connect, collaborate, and grow. Join a
          vibrant community of professionals and enthusiasts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button
            onClick={onJoinClick}
            className="group flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            Get Started Free
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center text-teal-600 mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-500">
              Kết nối và trao đổi với cộng đồng chuyên gia cùng chí hướng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center text-teal-600 mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Productivity</h3>
            <p className="text-gray-500">
              Tăng hiệu suất làm việc với bộ công cụ quản lý thông minh.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center text-teal-600 mb-4">
              <Book size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Share Resource</h3>
            <p className="text-gray-500">
              Chia sẻ và tiếp cận nguồn tài nguyên kiến thức vô tận.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hero Image / Mockup Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border-8 border-white"
      >
        <div className="h-64 sm:h-96 w-full bg-linear-to-br from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center">
          <span className="text-white/20 text-9xl font-bold select-none">
            UI PREVIEW
          </span>
        </div>
      </motion.div>
    </div>
  );
}
