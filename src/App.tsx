import { useState } from "react";
import "./global.css";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./pages/Dashboard";
import type { User } from "./types";

type ViewMode = "landing" | "login" | "dashboard";

function App() {
  const [view, setView] = useState<ViewMode>(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? "dashboard" : "landing";
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const goToLogin = () => setView("login");
  const goToHome = () => setView("landing");

  const handleLoginSuccess = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setView("landing");
  };

  return (
    <div className="antialiased text-gray-900">
      {view === "landing" && (
        <>
          <Navbar onLoginClick={goToLogin} onHomeClick={goToHome} />
          <Hero onJoinClick={goToLogin} />
          <footer className="py-12 bg-white border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} The Gathering. All rights
              reserved.
            </p>
          </footer>
        </>
      )}

      {view === "login" && (
        <LoginForm onBack={goToHome} onLoginSuccess={handleLoginSuccess} />
      )}

      {view === "dashboard" && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
