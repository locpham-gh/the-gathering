import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useRef, useCallback } from "react";
import VideoJS from "../VideoJS";
import videojs from "video.js";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  url,
  title,
}: VideoPlayerModalProps) {
  const playerRef = useRef<unknown>(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: url,
        type: url.toLowerCase().endsWith(".mp4") ? "video/mp4" : "video/webm",
      },
    ],
  };

  const handlePlayerReady = useCallback((player: unknown) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (player && typeof (player as any).on === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = player as any;
      p.on("waiting", () => {
        videojs.log("player is waiting");
      });

      p.on("dispose", () => {
        videojs.log("player will dispose");
      });
    }
  }, []);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Player Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-4xl overflow-hidden shadow-2xl border border-white/10 group"
          >
            {/* Header Controls (Visible on Hover) */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                  Now Playing
                </span>
                <h3 className="text-white font-bold truncate max-w-md">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all active:scale-90 pointer-events-auto"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Wrapper */}
            <div className="w-full h-full flex items-center justify-center bg-black video-js-custom-styles">
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </div>

            {/* Design Accents */}
            <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-white/5 opacity-50 pointer-events-none" />
            <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-white/5 opacity-50 pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-white/5 opacity-50 pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-white/5 opacity-50 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
