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
          title: `Welcome, ${user?.username}!`,
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
    <header className="flex justify-between items-center mb-10">
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {info.title}
        </h1>
        <p className="text-gray-500 font-medium mt-1">{info.desc}</p>
      </div>

      <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-2 rounded-full border border-white/50 shadow-sm transition-all hover:bg-white/60">
        <div className="text-right hidden sm:block px-3">
          <p className="text-sm font-bold text-gray-900 tracking-tight">
            {user?.username}
          </p>
          <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">
            {user?.role}
          </p>
        </div>
        <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-teal-200 transform transition-transform hover:scale-105 active:scale-95">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
