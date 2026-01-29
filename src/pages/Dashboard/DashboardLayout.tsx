import { useState } from "react";
import Library from "./Library/LibraryPage";
import Sidebar from "../../components/Layout/Navigation/Sidebar";
import type { DashboardView } from "../../components/Layout/Navigation/Sidebar";
import type { User } from "../../types";
import SettingsModal from "../../components/Layout/Modals/SettingsModal";
import UserDashboard from "./Overview/UserOverview";
import AdminPanel from "../Admin/AdminPanel";
import { MessageCircle, Calendar } from "lucide-react";
import DashboardHeader from "../../components/Layout/Navigation/DashboardHeader";

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={onLogout}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto z-10 transition-all duration-300">
        <DashboardHeader user={user} activeView={activeView} />

        {activeView === "overview" ? (
          user?.role === "admin" ? (
            <AdminPanel />
          ) : (
            <UserDashboard user={user} setActiveView={setActiveView} />
          )
        ) : activeView === "resources" ? (
          <Library />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${
                activeView === "forum"
                  ? "bg-indigo-50 text-indigo-500"
                  : "bg-rose-50 text-rose-500"
              }`}
            >
              {activeView === "forum" ? (
                <MessageCircle size={40} />
              ) : (
                <Calendar size={40} />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeView === "forum" ? "Community Forum" : "Events Booking"}
            </h2>
            <p className="text-gray-500 mt-2 max-w-sm">
              This feature is currently being gathered. Coming very soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
