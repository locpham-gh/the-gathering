import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  X,
  Settings,
  LogOut,
  User as UserIcon,
  Bell,
  Shield,
} from "lucide-react";
import type { User } from "../../../types";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: User | null;
}

type SettingsTab = "profile" | "notifications" | "security" | "logout";

export default function SettingsModal({
  isOpen,
  onClose,
  onLogout,
  user,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl h-[600px] bg-white rounded-[32px] shadow-2xl shadow-slate-900/20 overflow-hidden flex"
          >
            {/* Modal Sidebar */}
            <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col p-6">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                  <Settings size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Settings</h2>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={`flex items-center gap-3 w-full p-3 rounded-2xl font-semibold transition-all cursor-pointer ${
                      activeTab === item.id
                        ? "bg-white shadow-sm text-teal-600"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 w-full p-3 text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all cursor-pointer"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <header className="p-8 pb-0 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 capitalize">
                    {activeTab} Settings
                  </h3>
                  <p className="text-slate-500">
                    Manage your account preferences and info.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </header>

              <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[24px]">
                      <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-2xl font-bold border-4 border-white shadow-sm">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {user?.username}
                        </h4>
                        <p className="text-slate-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.username || ""}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-teal-500 focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email || ""}
                          disabled
                          className="w-full px-4 py-3 bg-slate-100 border-2 border-transparent rounded-xl text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== "profile" && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Settings size={32} />
                    </div>
                    <p className="font-bold text-slate-900">Coming Soon</p>
                    <p className="text-sm text-slate-500 max-w-[200px]">
                      We're working hard to bring this feature to you.
                    </p>
                  </div>
                )}
              </div>

              <footer className="p-8 pt-4 border-t border-slate-50 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-all cursor-pointer">
                  Save Changes
                </button>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
