import { motion } from "framer-motion";
import { LogOut, Layout, User, Settings, Book } from "lucide-react";
import { useState } from "react";
import Library from "./Library";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

type DashboardView = "overview" | "resources";

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <Layout size={20} />
          </div>
          <span className="font-bold text-xl text-gray-900 capitalize">
            {user?.role} Panel
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
            Overview
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {activeView === "overview"
                ? `Welcome, ${user?.username}!`
                : "Resource Library"}
            </h1>
            <p className="text-gray-500">
              {activeView === "overview"
                ? "Here's what's happening in The Gathering today."
                : "Explore and manage your digital content."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {activeView === "overview" ? (
          <>
            {/* Simple Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-gray-500 font-medium mb-1">
                  Total Members
                </h3>
                <p className="text-3xl font-bold text-gray-900">1,280</p>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-bold">
                  <span>+12% from last week</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-gray-500 font-medium mb-1">
                  Active Resources
                </h3>
                <p className="text-3xl font-bold text-gray-900">45</p>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-bold">
                  <span>+5 new today</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-gray-500 font-medium mb-1">
                  Engagement Rate
                </h3>
                <p className="text-3xl font-bold text-gray-900">78%</p>
                <div className="mt-4 flex items-center text-teal-600 text-sm font-bold">
                  <span>Very high</span>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 bg-white p-8 rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-4">
                <Layout size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to expand?
              </h3>
              <p className="text-gray-500 max-w-md">
                This is a simple dashboard placeholder to test your login
                integration. More features coming soon!
              </p>
            </div>
          </>
        ) : (
          <Library />
        )}
      </main>
    </div>
  );
}
