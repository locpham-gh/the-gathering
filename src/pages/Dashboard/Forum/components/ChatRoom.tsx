import React, { type RefObject } from "react";
import {
  MessageCircle,
  Users,
  Hash,
  ArrowLeft,
  Send,
  LogOut,
  Trash2,
  Plus,
} from "lucide-react";
import type { Room, Message } from "../types";

interface ChatRoomProps {
  selectedRoom: Room;
  setSelectedRoom: (room: Room | null) => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  sending: boolean;
  replyTo: { id: number; username: string; content: string } | null;
  setReplyTo: (
    reply: { id: number; username: string; content: string } | null,
  ) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleLeaveRoom: (room: Room) => void;
  handleDeleteRoom: (room: Room) => void;
  user: any;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  selectedRoom,
  setSelectedRoom,
  messages,
  newMessage,
  setNewMessage,
  sending,
  replyTo,
  setReplyTo,
  handleSendMessage,
  handleLeaveRoom,
  handleDeleteRoom,
  user,
  messagesEndRef,
}) => {
  return (
    <div className="h-full flex flex-col min-h-0 bg-white/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/50 shadow-sm animate-in fade-in zoom-in-[0.99] duration-500">
      {/* Chat Header */}
      <div className="px-8 py-6 border-b border-white/50 flex items-center justify-between bg-white/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedRoom(null)}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="font-bold text-slate-900 border-none leading-none mb-1">
              {selectedRoom.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-2">
              <span className="text-indigo-500 font-bold">
                #{selectedRoom.code}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>{selectedRoom.creator_name || "System"}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user?.id === selectedRoom.creator_id ? (
            <button
              onClick={() => handleDeleteRoom(selectedRoom)}
              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-2 text-xs font-bold"
              title="Delete Room"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          ) : (
            <button
              onClick={() => handleLeaveRoom(selectedRoom)}
              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-2 text-xs font-bold"
              title="Leave Room"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Leave</span>
            </button>
          )}
          <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Users size={14} />
            {selectedRoom.member_count || 0}
          </div>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-white/50 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                  <MessageCircle size={32} />
                </div>
                <p className="font-bold text-sm">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.username === user.username;
                return (
                  <div
                    key={msg.id}
                    className={`group p-4 rounded-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                      isOwn
                        ? "bg-indigo-50/50 border border-indigo-100/50"
                        : "hover:bg-white/40"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm ${
                          isOwn
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {msg.username ? msg.username[0].toUpperCase() : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                              {msg.username}{" "}
                              {isOwn && (
                                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md ml-1">
                                  YOU
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setReplyTo({
                                id: msg.id,
                                username: msg.username,
                                content: msg.content,
                              })
                            }
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all focus:opacity-100"
                            title="Reply"
                          >
                            <ArrowLeft size={14} className="rotate-180" />
                          </button>
                        </div>

                        {msg.parent_id && (
                          <div className="mb-2 p-3 bg-white/30 border-l-4 border-indigo-200 rounded-r-xl text-xs">
                            <p className="font-black text-indigo-400 mb-1 uppercase tracking-widest text-[9px]">
                              Replying to @{msg.parent_username}
                            </p>
                            <p className="text-slate-500 line-clamp-1 italic">
                              "{msg.parent_content}"
                            </p>
                          </div>
                        )}

                        <p
                          className={`text-sm leading-relaxed whitespace-pre-wrap ${
                            isOwn ? "text-slate-700" : "text-slate-600"
                          }`}
                        >
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/50 bg-white/10 shrink-0">
            {replyTo && (
              <div className="mb-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-1.5 h-6 bg-indigo-400 rounded-full" />
                  <div className="flex flex-col text-xs overflow-hidden">
                    <span className="font-black text-indigo-600 uppercase tracking-widest text-[10px]">
                      Replying to @{replyTo.username}
                    </span>
                    <span className="text-slate-500 truncate italic">
                      "{replyTo.content}"
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Plus size={16} className="rotate-45" />
                </button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                placeholder={
                  replyTo
                    ? `Reply to @${replyTo.username}...`
                    : `Message #${selectedRoom.code}`
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full pl-6 pr-14 py-4 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400 text-slate-700 font-medium"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Press Enter to send message
            </p>
          </div>
        </div>

        {/* Room Pixel-Art Sidebar Placeholder */}
        <div className="hidden xl:flex w-80 border-l border-white/50 bg-slate-900/5 backdrop-blur-md flex-col animate-in slide-in-from-right duration-500 shrink-0">
          <div className="p-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Room Simulation
            </h4>
            <div className="aspect-square bg-slate-800 rounded-4xl border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative text-center p-8 z-10 transition-transform duration-500 group-hover:scale-105">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse">
                  <Hash size={32} className="text-white/40" />
                </div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                  Pixel World
                </p>
                <p className="text-xs text-white font-medium opacity-60">
                  Interactive pixel simulation coming in next update!
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Online Users
            </h4>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                      U{i}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 border-2 border-slate-50 rounded-full" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Member {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
