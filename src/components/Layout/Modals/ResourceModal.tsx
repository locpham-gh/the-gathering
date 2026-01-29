import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  BookOpen,
  PlayCircle,
  Star,
  Heart,
  Share2,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import type { Resource } from "../../../types";

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export default function ResourceModal({
  isOpen,
  onClose,
  resource,
}: ResourceModalProps) {
  if (!resource) return null;

  const isVideo =
    resource.format === "mp4" || resource.content_type === "course";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 md:p-12 overflow-hidden">
          {/* Backdrop - Enhanced Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container - More Compact & Refined */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden relative z-10 flex flex-col md:flex-row border border-white/40"
          >
            {/* Close Button - Clean & Float */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 bg-white/40 hover:bg-white hover:scale-110 active:scale-95 rounded-full transition-all duration-300 z-20 backdrop-blur-md border border-white/50 group"
            >
              <X className="w-5 h-5 text-slate-900 group-hover:text-teal-600" />
            </button>

            {/* Left Column: Visual & Core Actions */}
            <div className="w-full md:w-[40%] bg-linear-to-b from-slate-50/50 to-white/20 p-8 flex flex-col items-center border-r border-white/40">
              <div className="w-full max-w-[260px] aspect-[3/4.2] shadow-2xl rounded-2xl overflow-hidden mb-6 border-4 border-white/80 transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={resource.thumbnail_url}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full max-w-[260px] space-y-3">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-teal-600 transition-all duration-300 shadow-xl shadow-slate-200/50 flex items-center justify-center group active:scale-95"
                >
                  {isVideo ? (
                    <PlayCircle className="w-5 h-5 mr-2.5 group-hover:animate-pulse" />
                  ) : (
                    <BookOpen className="w-5 h-5 mr-2.5" />
                  )}
                  {isVideo ? "Watch Now" : "Read Now"}
                </a>

                <button className="w-full py-3.5 bg-white/50 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all duration-300 flex items-center justify-center active:scale-95">
                  Save to Library
                </button>

                <div className="flex justify-center gap-4 pt-2">
                  <button className="p-3 bg-white/60 rounded-xl shadow-sm hover:text-rose-500 hover:bg-white transition-all border border-white/50">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/60 rounded-xl shadow-sm hover:text-blue-500 hover:bg-white transition-all border border-white/50">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="w-full md:w-[60%] p-8 overflow-y-auto custom-scrollbar bg-white/20">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-teal-50/80 text-teal-700 text-[9px] font-black uppercase tracking-[0.15em] rounded-md border border-teal-100">
                  {resource.content_type}
                </span>
                <span className="px-2.5 py-1 bg-indigo-50/80 text-indigo-700 text-[9px] font-black uppercase tracking-[0.15em] rounded-md border border-indigo-100">
                  {resource.category}
                </span>
                <span className="px-2.5 py-1 bg-amber-50/80 text-amber-700 text-[9px] font-black uppercase tracking-[0.15em] rounded-md border border-amber-100">
                  {resource.format}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-slate-900 leading-tight mb-2 tracking-tight">
                {resource.title}
              </h2>
              <p className="text-lg text-teal-600 font-bold mb-6">
                by {resource.author}
              </p>

              {/* Stats - More Compact */}
              <div className="grid grid-cols-3 gap-6 mb-8 py-5 border-y border-slate-100/50">
                <div className="flex flex-col">
                  <div className="flex items-center text-slate-900 font-semibold text-lg mb-0.5">
                    4.8{" "}
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current ml-1" />
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Rating
                  </span>
                </div>
                <div className="flex flex-col border-x border-slate-100/50 px-6">
                  <div className="text-slate-900 font-semibold text-lg mb-0.5">
                    1.2k
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Readers
                  </span>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="text-slate-900 font-semibold text-lg mb-0.5">
                    EN
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Language
                  </span>
                </div>
              </div>

              {/* Uploader & Date */}
              <div className="flex gap-10 mb-8 p-4 bg-slate-50/40 rounded-2xl border border-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest">
                      Shared By
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {resource.uploader_username || "Admin"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-widest">
                      Date
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {resource.created_at
                        ? new Date(resource.created_at).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="prose prose-slate max-w-none">
                <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2.5 text-teal-600" />
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed text-base italic font-medium">
                  "{resource.description}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
