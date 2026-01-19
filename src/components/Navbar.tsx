import { LogIn, Users } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
  onHomeClick: () => void;
}

export default function Navbar({ onLoginClick, onHomeClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div
        className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        onClick={onHomeClick}
      >
        <h1 className="bg-teal-600 p-2 rounded-lg text-white text-xl font-bold select-none cursor-default">
          TG
        </h1>
        <span className="text-2xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          The Gathering
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onHomeClick}
          className="text-gray-600 hover:text-teal-600 font-medium transition-colors cursor-pointer"
        >
          Home
        </button>
        <button
          onClick={onLoginClick}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-teal-700 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <LogIn size={18} />
          Login
        </button>
      </div>
    </nav>
  );
}
