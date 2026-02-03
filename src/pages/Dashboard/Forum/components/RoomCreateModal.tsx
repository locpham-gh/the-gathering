import React from "react";

interface RoomCreateModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  newRoomTitle: string;
  setNewRoomTitle: (title: string) => void;
  handleCreateRoom: (e: React.FormEvent) => void;
}

const RoomCreateModal: React.FC<RoomCreateModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  newRoomTitle,
  setNewRoomTitle,
  handleCreateRoom,
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/50 animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Create New Room
        </h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">
          Build your own space for discussion and pixel simulation.
        </p>

        <form onSubmit={handleCreateRoom} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Room Title
            </label>
            <input
              autoFocus
              type="text"
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
              placeholder="e.g. Pixel Engineers Hub"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-bold"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newRoomTitle.trim()}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none uppercase tracking-widest text-xs"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomCreateModal;
