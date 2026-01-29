import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, FileText, Filter, Video, Star } from "lucide-react";

import { fetchResources } from "../../../api/resources";
import type { Resource } from "../../../types";
import ResourceModal from "../../../components/Layout/Modals/ResourceModal";

export default function Library() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [selectedBook, setSelectedBook] = useState<Resource | null>(null);

  const filters = [
    { label: "All Content", value: "all" },
    { label: "Guides", value: "guide" },
    { label: "E-books", value: "ebook" },
    { label: "Courses", value: "course" },
  ];

  const categories = ["Productivity", "Wellness", "Tech", "Career", "Finance"];

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const data = await fetchResources(search, activeType);
        if (data.success) {
          setResources(data.data);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [search, activeType]);

  const getFormatIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <FileText className="w-3 h-3" />;
      case "ebook":
        return <BookOpen className="w-3 h-3" />;
      case "course":
        return <Video className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-md border border-white/50 rounded-full focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-64 shrink-0 overflow-y-auto pr-2">
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm mb-6 transition-all">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Content Types
            </h3>
            <div className="space-y-2">
              {filters.map((filter) => (
                <label
                  key={filter.value}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="format"
                    checked={activeType === filter.value}
                    onChange={() => setActiveType(filter.value)}
                    className="form-radio text-teal-600 focus:ring-teal-500 w-4 h-4 border-gray-300"
                  />
                  <span
                    className={`text-sm ${
                      activeType === filter.value
                        ? "text-teal-700 font-bold"
                        : "text-gray-600 group-hover:text-teal-600"
                    }`}
                  >
                    {filter.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm transition-all">
            <h3 className="font-bold text-gray-800 mb-4">Topics</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex justify-between items-center text-sm text-gray-600 hover:text-teal-600 cursor-pointer p-2 hover:bg-white/50 rounded-lg transition"
                >
                  <span>{cat}</span>
                  <span className="bg-white/50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/50">
                    {Math.floor(Math.random() * 20) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide px-1">
          {/* Books Grid */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {activeType === "all"
                  ? "All Resources"
                  : `${activeType.charAt(0).toUpperCase() + activeType.slice(1)}s`}
              </h3>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                {resources.length} items found
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="bg-white/20 backdrop-blur-sm rounded-3xl h-72 animate-pulse border border-white/50"
                  ></div>
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                <AnimatePresence mode="popLayout">
                  {resources.map((resource) => (
                    <motion.div
                      key={resource.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedBook(resource)}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-2/3 mb-4 bg-slate-100 rounded-4xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border-4 border-white">
                        <img
                          src={resource.thumbnail_url}
                          alt={resource.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay Type Icon */}
                        <div className="absolute top-3 right-3 bg-white/80 text-slate-900 p-2 rounded-xl backdrop-blur-md border border-white/50 shadow-sm">
                          {getFormatIcon(resource.content_type)}
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-2xl uppercase tracking-tighter">
                            Quick View
                          </span>
                        </div>
                      </div>
                      <div className="px-1">
                        <h4 className="font-medium text-slate-900 text-sm leading-snug mb-1 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {resource.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                          {resource.author}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-slate-600 font-black">
                            4.8
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white/30 backdrop-blur-md rounded-[3rem] p-20 text-center border border-white/50 border-dashed">
                <div className="bg-white/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Search size={40} className="text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">
                  No resources found
                </h3>
                <p className="text-slate-500 font-medium">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResourceModal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        resource={selectedBook}
      />
    </div>
  );
}
