import React from "react";
import { MessageCircle, Plus, Users, Hash, Trash2 } from "lucide-react";
import type { Room } from "../types";
import type { User } from "../../../../types";

interface RoomListProps {
  rooms: Room[];
  activeTab: "joined" | "explore";
  setActiveTab: (tab: "joined" | "explore") => void;
  loading: boolean;
  handleOpenRoom: (room: Room) => void;
  handleDeleteRoom: (room: Room) => void;
  setShowCreateModal: (show: boolean) => void;
  user: User;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  activeTab,
  setActiveTab,
  loading,
  handleOpenRoom,
  handleDeleteRoom,
  setShowCreateModal,
  user,
}) => {
  const filteredRooms = rooms.filter((room) =>
    activeTab === "joined" ? room.is_member : true,
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/50 shadow-sm">
          <button
            onClick={() => setActiveTab("joined")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "joined"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            My Rooms
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "explore"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Explore
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} />
          <span>New Room</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[250px] bg-white/20 rounded-[2.5rem] animate-pulse border border-white/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {filteredRooms.length === 0 ? (
              <div className="col-span-full h-64 bg-white/30 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-white/50 flex flex-col items-center justify-center text-slate-400">
                <Hash size={48} className="mb-4 opacity-20" />
                <p className="font-bold">
                  {activeTab === "joined"
                    ? "You haven't joined any rooms yet."
                    : "No rooms available yet."}
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleOpenRoom(room)}
                  className="group bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/50 shadow-sm hover:shadow-xl hover:bg-white/60 transition-all duration-500 cursor-pointer flex flex-col h-full animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm shadow-indigo-100">
                      <Hash size={24} />
                    </div>
                    {room.is_member && (
                      <div className="flex items-center gap-2">
                        {user?.id === room.creator_id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoom(room);
                            }}
                            className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                            title="Delete Room"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Joined
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-6">
                    Code:{" "}
                    <span className="text-indigo-500 font-bold">
                      #{room.code}
                    </span>
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Users size={16} />
                        <span className="text-xs font-bold">
                          {room.member_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MessageCircle size={16} />
                        <span className="text-xs font-bold">
                          {room.message_count || 0}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:mr-2 transition-all">
                      {room.is_member ? "Enter →" : "Join →"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
