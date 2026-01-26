import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  ExternalLink,
  FileText,
  PlayCircle,
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  content_type: "guide" | "ebook" | "course";
  category: string;
  author: string;
  url: string;
  thumbnail_url: string;
}

export default function Library() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");

  useEffect(() => {
    fetchResources();
  }, [search, activeType]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (activeType !== "all") queryParams.append("type", activeType);

      const response = await fetch(
        `http://localhost:5000/api/resources?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <FileText className="text-blue-500" size={20} />;
      case "ebook":
        return <BookOpen className="text-emerald-500" size={20} />;
      case "course":
        return <PlayCircle className="text-purple-500" size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {["all", "guide", "ebook", "course"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-xl font-bold capitalize transition-all whitespace-nowrap ${
                activeType === type
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type === "all" ? "All Content" : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"
            ></div>
          ))}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center gap-2">
                      {getTypeIcon(resource.content_type)}
                      <span className="capitalize">
                        {resource.content_type}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                    {resource.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                    <span className="text-xs text-gray-400 font-medium">
                      By {resource.author}
                    </span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all"
                    >
                      <ExternalLink size={18} />
                    </a>
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
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
}
