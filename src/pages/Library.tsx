import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  FileText,
  PlayCircle,
  Filter,
  Video,
  Star,
  X,
  Heart,
  Share2,
} from "lucide-react";

import { fetchResources } from "../api/resources";
import type { Resource } from "../types";

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
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Digital Library</h2>
          <p className="text-gray-500">
            Discover your next great read or skill.
          </p>
        </div>
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-64 shrink-0 overflow-y-auto pr-2">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Content Type
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
                        ? "text-teal-700 font-medium"
                        : "text-gray-600 group-hover:text-teal-600"
                    }`}
                  >
                    {filter.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Topics</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex justify-between items-center text-sm text-gray-600 hover:text-teal-600 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <span>{cat}</span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    {Math.floor(Math.random() * 20) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide px-1">
          {/* Hero Banner (Featured) */}
          <div className="bg-linear-to-r from-teal-800 to-teal-600 rounded-2xl p-6 mb-8 text-white flex items-center justify-between shadow-lg">
            <div className="max-w-lg">
              <span className="bg-teal-500/30 text-teal-50 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                FEATURED RESOURCE
              </span>
              <h2 className="text-3xl font-bold mb-2">
                Mastering The Gathering
              </h2>
              <p className="text-teal-100 mb-6 line-clamp-2">
                Learn the essential strategies to manage your digital resources
                effectively and build a productive community foundation.
              </p>
              <button className="bg-white text-teal-900 px-6 py-2 rounded-lg font-bold hover:bg-teal-50 transition shadow-md">
                Read Now
              </button>
            </div>
            <div className="md:block w-32 h-44 bg-teal-700/50 rounded-lg shadow-2xl transform rotate-6 border-4 border-white/20 shrink-0 flex items-center justify-center overflow-hidden">
              <BookOpen className="w-16 h-16 text-white/20" />
            </div>
          </div>

          {/* Books Grid */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {activeType === "all"
                  ? "All Resources"
                  : `${activeType.charAt(0).toUpperCase() + activeType.slice(1)}s`}
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {resources.length} items found
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl h-64 animate-pulse border border-gray-100"
                  ></div>
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                      <div className="relative aspect-2/3 mb-3 bg-gray-100 rounded-lg overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border border-gray-200">
                        <img
                          src={resource.thumbnail_url}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay Type Icon */}
                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm">
                          {getFormatIcon(resource.content_type)}
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-teal-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            View Details
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 group-hover:text-teal-600 transition line-clamp-2">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {resource.author}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 font-medium">
                            4.8
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 border-dashed">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No resources found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row overflow-hidden"
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition z-20"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Left: Cover & Actions */}
              <div className="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col items-center border-r border-gray-100">
                <div className="w-48 aspect-2/3 shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-200">
                  <img
                    src={selectedBook.thumbnail_url}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full space-y-3">
                  <a
                    href={selectedBook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-md flex items-center justify-center"
                  >
                    {selectedBook.content_type === "course" ? (
                      <PlayCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <BookOpen className="w-5 h-5 mr-2" />
                    )}
                    {selectedBook.content_type === "course"
                      ? "Start Learning"
                      : "Read Now"}
                  </a>

                  <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-white hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center">
                    Preview Sample
                  </button>

                  <div className="flex justify-center space-x-4 pt-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-2/3 p-8">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded uppercase tracking-wider">
                    {selectedBook.content_type}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider">
                    {selectedBook.category}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedBook.title}
                </h2>
                <p className="text-lg text-teal-600 font-medium mb-6">
                  {selectedBook.author}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8 border-y border-gray-100 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg flex items-center">
                      4.8{" "}
                      <Star className="w-4 h-4 text-yellow-400 fill-current ml-1" />
                    </span>
                    <span>Rating</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg">
                      1.2k
                    </span>
                    <span>Reads</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg">
                      English
                    </span>
                    <span>Language</span>
                  </div>
                </div>

                <div className="prose prose-teal">
                  <h3 className="font-bold text-gray-900 mb-2">Synopsis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedBook.description}
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 mb-3">
                    More by this author
                  </h3>
                  <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-20 h-28 bg-gray-100 rounded-lg shrink-0 border border-gray-200"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
