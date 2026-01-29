import { LogIn } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
  onHomeClick: () => void;
}

export default function Navbar({ onLoginClick, onHomeClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-white/60 border-b border-gray-100 transition-all duration-300">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onHomeClick}
      >
        <div className="bg-teal-600 p-2.5 rounded-xl text-white shadow-lg shadow-teal-100 group-hover:scale-110 group-hover:zoom-110 transition-all duration-300">
          <span className="text-xl font-black">TG</span>
        </div>
        <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          The Gathering
        </span>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={onHomeClick}
          className="text-slate-500 hover:text-teal-600 font-bold transition-colors cursor-pointer text-sm uppercase tracking-widest"
        >
          Home
        </button>
        <button
          onClick={onLoginClick}
          className="flex items-center gap-2 bg-slate-900 text-white px-7 py-3 rounded-2xl font-bold hover:bg-black transition-all hover:shadow-2xl hover:shadow-slate-200 active:scale-95 cursor-pointer text-sm shadow-xl shadow-slate-900/10"
        >
          <LogIn size={18} />
          Login
        </button>
      </div>
    </nav>
  );
}
