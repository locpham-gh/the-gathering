import { motion } from "framer-motion";
import { Layout, Book, Settings, MessageCircle, Calendar } from "lucide-react";
import type { User } from "../../../types";

export type DashboardView = "overview" | "resources" | "forum" | "events";

interface SidebarProps {
  user: User | null;
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  onOpenSettings,
}: SidebarProps) {
  const menuItems = [
    { id: "overview", icon: Layout, label: "Dashboard" },
    { id: "resources", icon: Book, label: "Library" },
    { id: "forum", icon: MessageCircle, label: "Forum" },
    { id: "events", icon: Calendar, label: "Events" },
  ];

  return (
    <aside className="w-20 h-screen flex-none bg-white/40 backdrop-blur-xl border-r border-white/20 hidden md:flex flex-col sticky top-0 items-center py-6 z-20">
      <div className="mb-10 px-4">
        <div className="bg-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-100 select-none cursor-default">
          TG
        </div>
      </div>

      <nav className="flex-1 space-y-4 w-full px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as DashboardView)}
            title={item.label}
            className={`flex items-center justify-center w-full aspect-square rounded-2xl transition-all cursor-pointer relative group ${
              activeView === item.id
                ? "bg-teal-50 text-teal-600"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            }`}
          >
            <item.icon size={24} />
            {activeView === item.id && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute left-[-12px] w-1.5 h-8 bg-teal-600 rounded-r-full"
              />
            )}

            {/* Tooltip hint on hover (simple version) */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-xl">
              {item.label}
              <div className="absolute top-1/2 left-[-4px] transform -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-100 w-full px-3">
        <button
          onClick={onOpenSettings}
          title="Settings"
          className="flex items-center justify-center w-full aspect-square text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-2xl transition-all cursor-pointer group relative"
        >
          <Settings size={24} />
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-xl">
            Settings
            <div className="absolute top-1/2 left-[-4px] transform -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </button>
      </div>
    </aside>
  );
}
