import { useState, useEffect } from "react";
import "./global.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

type ViewMode = "landing" | "login" | "dashboard";

function App() {
  const [view, setView] = useState<ViewMode>("landing");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing token/user in localStorage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // In a real app, we would verify the token here
      // For now, let's look for a saved user object
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setView("dashboard");
      }
    }
  }, []);

  const goToLogin = () => setView("login");
  const goToHome = () => setView("landing");

  const handleLoginSuccess = (token: string, userData: any) => {
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
