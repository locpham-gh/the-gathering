import { motion } from "framer-motion";
import { Video, ArrowRight, Book, MessageCircle, Calendar } from "lucide-react";
import type { DashboardView } from "../../../components/Layout/Navigation/Sidebar";
import type { User } from "../../../types";

interface UserDashboardProps {
  user: User | null;
  setActiveView: (view: DashboardView) => void;
}

export default function UserDashboard({
  user,
  setActiveView,
}: UserDashboardProps) {
  return (
    <div className="space-y-10 relative pb-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-slate-900 to-slate-800 p-10 text-white shadow-2xl shadow-slate-900/20"
      >
        <div className="relative z-10 max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-teal-500/20 backdrop-blur-md text-teal-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6"
          >
            Welcome back, {user?.username || "to the gathering"}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Your digital space for{" "}
            <span className="text-teal-400">meaningful</span> connection.
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
            Explore resources, join conversations, and book your next session
            from your personal command center.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveView("resources")}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-teal-500/20"
            >
              Browse Library
            </button>
            <button
              onClick={() => setActiveView("forum")}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 transition-all cursor-pointer"
            >
              Join Forum
            </button>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none bg-linear-to-l from-teal-500/30 to-transparent" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]" />
      </motion.div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Digital Library",
            desc: "Explore a curated collection of knowledge, skill-building guides and expert resources.",
            icon: Book,
            view: "resources",
            color: "teal",
            count: "45+ Resources",
          },
          {
            title: "Community Forum",
            desc: "Share your thoughts, ask questions and collaborate with like-minded members.",
            icon: MessageCircle,
            view: "forum",
            color: "indigo",
            count: "128 Active Threads",
          },
          {
            title: "Events Booking",
            desc: "Don't miss out! Secure your spot in the most exciting upcoming live gatherings.",
            icon: Calendar,
            view: "events",
            color: "rose",
            count: "8 Upcoming",
          },
        ].map((item, idx) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 + 0.3 }}
            onClick={() => setActiveView(item.view as DashboardView)}
            className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all text-left overflow-hidden cursor-pointer flex flex-col h-full"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-3 ${
                item.color === "teal"
                  ? "bg-teal-50 text-teal-600 shadow-lg shadow-teal-100/50"
                  : item.color === "indigo"
                    ? "bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100/50"
                    : "bg-rose-50 text-rose-600 shadow-lg shadow-rose-100/50"
              }`}
            >
              <item.icon size={26} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                {item.title}
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">{item.desc}</p>
            </div>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {item.count}
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ArrowRight size={20} />
              </div>
            </div>
            <div
              className={`absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-1 pointer-events-none rounded-full ${
                item.color === "teal"
                  ? "bg-teal-400/10"
                  : item.color === "indigo"
                    ? "bg-indigo-400/10"
                    : "bg-rose-400/10"
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Join Room Section */}
      <div className="flex flex-col items-center justify-center py-10 px-6 bg-linear-to-br from-indigo-50 to-teal-50 rounded-[40px] border border-white shadow-inner">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-lg bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="w-20 h-20 bg-white rounded-[24px] shadow-lg flex items-center justify-center text-teal-600 mb-8 mx-auto border border-teal-50">
            <Video size={40} className="animate-pulse" />
          </div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">
              Join Gathering
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Enter your{" "}
              <span className="text-teal-600 font-bold">Room Code</span> to
              start connecting.
            </p>
          </div>
          <div className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="ABC-123-XYZ"
                className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-teal-500 shadow-sm focus:shadow-xl focus:shadow-teal-100/30 transition-all text-center text-2xl font-black font-mono tracking-[0.2em] uppercase placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-300 placeholder:text-lg"
              />
            </div>
            <button className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group transition-all transform hover:translate-y-[-2px] active:scale-95 cursor-pointer text-lg">
              Connect to Gathering
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </button>
          </div>
          <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-center gap-2 text-sm">
            <span className="text-slate-400">Locked and secured by</span>
            <span className="text-slate-900 font-black">The Gathering</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
