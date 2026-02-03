import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  BookOpen,
  FileText,
  Video,
  Trash2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Image as ImageIcon,
  Edit2,
} from "lucide-react";
import { fetchResources } from "../../api/resources";
import type { Resource } from "../../types";

export default function AdminLibrary() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_type: "guide",
    category: "Productivity",
    author: "",
    format: "pdf",
  });
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await fetchResources("", "all");
      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const openAddModal = () => {
    setEditingResource(null);
    setFormData({
      title: "",
      description: "",
      content_type: "guide",
      category: "Productivity",
      author: "",
      format: "pdf",
    });
    setFile(null);
    setThumbnail(null);
    setMessage(null);
    setShowUploadModal(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setFormData({
      title: res.title,
      description: res.description,
      content_type: res.content_type,
      category: res.category,
      author: res.author,
      format: res.format || "pdf",
    });
    setFile(null);
    setThumbnail(null);
    setMessage(null);
    setShowUploadModal(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("file", file);
    if (thumbnail) data.append("thumbnail", thumbnail);

    try {
      const url = editingResource
        ? `/api/resources/${editingResource.id}`
        : "/api/resources/upload";
      const method = editingResource ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: editingResource
            ? "Resource updated successfully!"
            : "Resource uploaded successfully!",
        });

        // Brief delay before closing to show success message
        setTimeout(() => {
          setShowUploadModal(false);
          loadResources();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Operation failed",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredResources = resources.filter(
    (res) =>
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
          />
          <Search
            className="absolute left-4 top-3.5 text-slate-600"
            size={18}
          />
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resources Table/List */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Resource
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Type
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Author
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td
                      colSpan={5}
                      className="px-8 py-8 h-16 bg-slate-800/20"
                    ></td>
                  </tr>
                ))
              ) : filteredResources.length > 0 ? (
                filteredResources.map((res) => (
                  <tr
                    key={res.id}
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                          <img
                            src={res.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate max-w-[200px]">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                            {res.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        {res.content_type === "course" ? (
                          <Video size={14} />
                        ) : (
                          <FileText size={14} />
                        )}
                        <span className="text-xs font-bold uppercase">
                          {res.content_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-slate-400">
                      {res.author}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase">
                        {res.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(res)}
                          className="p-2 text-slate-600 hover:text-indigo-400 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <BookOpen size={40} className="text-slate-700 mb-4" />
                      <p className="text-slate-500 font-bold">
                        No resources found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => !isUploading && setShowUploadModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 p-10 relative custom-scrollbar"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  {editingResource ? "Edit Resource" : "Upload New Resource"}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {editingResource
                    ? `Modifying "${editingResource.title}"`
                    : "Configure and publish a document or video."}
                </p>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Author
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Content Type
                    </label>
                    <select
                      className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                      value={formData.content_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          content_type: e.target.value,
                        })
                      }
                    >
                      <option value="guide">Guide</option>
                      <option value="ebook">E-book</option>
                      <option value="course">Course</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Category
                    </label>
                    <select
                      className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="Productivity">Productivity</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Tech">Tech</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                      Format
                    </label>
                    <select
                      className="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                      value={formData.format}
                      onChange={(e) =>
                        setFormData({ ...formData, format: e.target.value })
                      }
                    >
                      <option value="pdf">PDF</option>
                      <option value="mp4">MP4</option>
                      <option value="epub">EPUB</option>
                    </select>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <FileUp size={12} /> Resource File
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        onChange={(e) =>
                          setFile(e.target.files ? e.target.files[0] : null)
                        }
                        className="hidden"
                        id="resource-file"
                      />
                      <label
                        htmlFor="resource-file"
                        className="flex flex-col items-center justify-center w-full h-32 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer group-hover:bg-slate-800 group-hover:border-indigo-500 transition-all text-slate-500"
                      >
                        {file ? (
                          <div className="flex flex-col items-center p-4">
                            <CheckCircle2
                              className="text-emerald-500 mb-1"
                              size={24}
                            />
                            <span className="text-xs font-bold text-white truncate max-w-[150px]">
                              {file.name}
                            </span>
                          </div>
                        ) : (
                          <>
                            <Upload size={20} className="mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Choose File
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <ImageIcon size={12} /> Thumbnail
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setThumbnail(
                            e.target.files ? e.target.files[0] : null,
                          )
                        }
                        className="hidden"
                        id="thumb-file"
                      />
                      <label
                        htmlFor="thumb-file"
                        className="flex flex-col items-center justify-center w-full h-32 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer group-hover:bg-slate-800 group-hover:border-indigo-500 transition-all text-slate-500"
                      >
                        {thumbnail ? (
                          <div className="flex flex-col items-center p-4">
                            <CheckCircle2
                              className="text-emerald-500 mb-1"
                              size={24}
                            />
                            <span className="text-xs font-bold text-white truncate max-w-[150px]">
                              {thumbnail.name}
                            </span>
                          </div>
                        ) : (
                          <>
                            <Upload size={20} className="mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Choose Image
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-2xl border flex items-center gap-3 ${
                      message.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-500"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <span className="text-sm font-bold">{message.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        {editingResource ? "Updating..." : "Uploading..."}
                      </span>
                    </>
                  ) : editingResource ? (
                    "Update Resource"
                  ) : (
                    "Publish Resource"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
