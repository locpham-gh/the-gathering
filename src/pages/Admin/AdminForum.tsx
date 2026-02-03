import { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  Hash,
  Eye,
  ToggleLeft,
  ToggleRight,
  Activity,
  ArrowLeft,
  Search,
} from "lucide-react";
import {
  fetchAdminRooms,
  toggleRoomStatus,
  fetchAdminMessages,
} from "../../api/forum";

interface AdminRoom {
  id: number;
  title: string;
  code: string;
  creator_name: string;
  member_count: number;
  message_count: number;
  is_active: boolean;
  created_at: string;
}

interface Message {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

export default function AdminForum() {
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoringRoom, setMonitoringRoom] = useState<AdminRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAdminRooms();
  }, []);

  useEffect(() => {
    let interval: any;
    if (monitoringRoom) {
      loadMessages();
      interval = setInterval(loadMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [monitoringRoom]);

  const loadAdminRooms = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminRooms();
      if (result.success) setRooms(result.data);
    } catch (error) {
      console.error("Error loading admin rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!monitoringRoom) return;
    try {
      const result = await fetchAdminMessages(monitoringRoom.code);
      if (result.success) setMessages(result.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleToggleStatus = async (room: AdminRoom) => {
    try {
      const newStatus = !room.is_active;
      const result = await toggleRoomStatus(room.code, newStatus);
      if (result.success) {
        setRooms(
          rooms.map((r) =>
            r.id === room.id ? { ...r, is_active: newStatus } : r,
          ),
        );
      }
    } catch (error) {
      alert("Failed to update room status");
    }
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    totalRooms: rooms.length,
    activeRooms: rooms.filter((r) => r.is_active).length,
    totalMessages: rooms.reduce((acc, r) => acc + Number(r.message_count), 0),
  };

  if (monitoringRoom) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <button
          onClick={() => setMonitoringRoom(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Management
        </button>

        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col h-[600px]">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Hash size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-none mb-1">
                  Monitoring: {monitoringRoom.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium font-mono">
                  #{monitoringRoom.code}
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
              Admin Read-only Mode
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <MessageCircle size={48} className="mb-4" />
                <p className="font-bold">No activity in this room</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                    {msg.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-slate-900">
                        {msg.username}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Hash size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Total Rooms
            </span>
          </div>
          <p className="text-4xl font-black text-slate-900">
            {stats.totalRooms}
          </p>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
              <Activity size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Active Rooms
            </span>
          </div>
          <p className="text-4xl font-black text-slate-900">
            {stats.activeRooms}
          </p>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <MessageCircle size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Total Messages
            </span>
          </div>
          <p className="text-4xl font-black text-slate-900">
            {stats.totalMessages}
          </p>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-900">Room Management</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-64"
            />
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Room
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Creator
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Stats
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-4">
                      <div className="h-12 bg-slate-50 rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-center text-slate-400 font-bold"
                  >
                    No rooms found
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                          {room.title[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {room.title}
                          </div>
                          <div className="text-xs text-indigo-500 font-mono">
                            #{room.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-600">
                        {room.creator_name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-4 text-slate-400">
                        <div
                          className="flex items-center gap-1.5"
                          title="Members"
                        >
                          <Users size={14} />
                          <span className="text-xs font-bold">
                            {room.member_count}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1.5"
                          title="Messages"
                        >
                          <MessageCircle size={14} />
                          <span className="text-xs font-bold">
                            {room.message_count}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          room.is_active
                            ? "bg-teal-50 text-teal-600 border-teal-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {room.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(room)}
                          className={`p-2 rounded-xl transition-all ${
                            room.is_active
                              ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              : "text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                          }`}
                          title={
                            room.is_active ? "Disable Room" : "Enable Room"
                          }
                        >
                          {room.is_active ? (
                            <ToggleRight size={24} />
                          ) : (
                            <ToggleLeft size={24} />
                          )}
                        </button>
                        <button
                          onClick={() => setMonitoringRoom(room)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Monitor Room Activity"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
