import { useState } from "react";
import AdminSidebar, {
  type AdminView,
} from "../../components/Layout/Navigation/AdminSidebar";
import AdminPanel from "./AdminPanel";
import AdminLibrary from "./AdminLibrary";
import SettingsModal from "../../components/Layout/Modals/SettingsModal";
import type { User } from "../../types";

interface AdminDashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function AdminDashboard({
  user,
  onLogout,
}: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="h-screen bg-[#020617] flex overflow-hidden relative">
      {/* Technical Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#6366f1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <AdminSidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={onLogout}
        user={user}
      />

      <main className="flex-1 p-10 overflow-y-auto z-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {activeView === "overview"
                ? "System Analytics"
                : activeView === "forum"
                  ? "Forum Moderation"
                  : activeView === "users"
                    ? "User Management"
                    : "Admin Settings"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                System Online
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-2xl border border-slate-800 transition-all active:scale-95"
          >
            <span className="sr-only">Settings</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        </header>

        {activeView === "overview" || activeView === "forum" ? (
          <AdminPanel
            initialTab={activeView === "forum" ? "forum" : "overview"}
          />
        ) : activeView === "library" ? (
          <AdminLibrary />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Module Under Construction
            </h3>
            <p className="text-slate-500 max-w-sm">
              This management module is currently being developed for the
              Command Center.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
