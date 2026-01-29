import { motion } from "framer-motion";

export default function AdminPanel() {
  return (
    <div className="space-y-8">
      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="text-gray-500 font-medium mb-1">Total Members</h3>
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
          <h3 className="text-gray-500 font-medium mb-1">Active Resources</h3>
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
          <h3 className="text-gray-500 font-medium mb-1">Engagement Rate</h3>
          <p className="text-3xl font-bold text-gray-900">78%</p>
          <div className="mt-4 flex items-center text-teal-600 text-sm font-bold">
            <span>Very high</span>
          </div>
        </motion.div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Ready to expand?
        </h3>
        <p className="text-gray-500 max-w-md">
          This is the administrative control panel. More management features
          coming soon!
        </p>
      </div>
    </div>
  );
}
