import { Layout, Book, User, Settings, LogOut } from "lucide-react";

export type DashboardView = "overview" | "resources";

interface SidebarProps {
  user: any;
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        <h1 className="bg-teal-600 p-2 rounded-lg text-white text-xl font-bold select-none cursor-default">
          TG
        </h1>
        <span className="text-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          The Gathering
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveView("overview")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl font-semibold transition-all cursor-pointer ${
            activeView === "overview"
              ? "bg-teal-50 text-teal-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Layout size={20} />
          Dashboard
        </button>

        <button
          onClick={() => setActiveView("resources")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl font-semibold transition-all cursor-pointer ${
            activeView === "resources"
              ? "bg-teal-50 text-teal-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Book size={20} />
          Library
        </button>

        <button className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <User size={20} />
          Profile
        </button>
        <button className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
          <Settings size={20} />
          Settings
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
