import type { User } from "../../../types";
import type { DashboardView } from "./Sidebar";

interface DashboardHeaderProps {
  user: User | null;
  activeView: DashboardView;
}

export default function DashboardHeader({
  user,
  activeView,
}: DashboardHeaderProps) {
  const getHeaderInfo = () => {
    switch (activeView) {
      case "overview":
        return {
          title: `Welcome, ${user?.username || "there"}!`,
          desc: "Here's what's happening in The Gathering today.",
        };
      case "resources":
        return {
          title: "Resource Library",
          desc: "Explore and manage your digital content.",
        };
      case "forum":
        return {
          title: "Community Forum",
          desc: "Join the conversation with other members.",
        };
      case "events":
        return {
          title: "Upcoming Events",
          desc: "Book and manage your gathering sessions.",
        };
      default:
        return { title: "Dashboard", desc: "" };
    }
  };

  const info = getHeaderInfo();

  return (
    <header className="flex justify-between items-center py-4 px-6 mb-4 bg-white/60 backdrop-blur-xl rounded-full border border-white/50 shadow-sm sticky top-0 z-50">
      <div className="animate-in fade-in slide-in-from-left-2 duration-500">
        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
          {info.title}
        </h1>
        <p className="text-[11px] text-gray-500 font-bold mt-1.5 uppercase tracking-wider">
          {info.desc}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-1.5 rounded-full border border-white/50 shadow-sm transition-all hover:bg-white/80">
        <div className="text-right hidden sm:block px-2">
          <p className="text-xs font-black text-gray-900 tracking-tight">
            {user?.username}
          </p>
          <p className="text-[9px] text-teal-600 font-bold uppercase tracking-widest">
            {user?.role}
          </p>
        </div>
        <div className="w-8 h-8 bg-linear-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg shadow-teal-200/50 transform transition-transform hover:scale-105 active:scale-95">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
