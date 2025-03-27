
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus,
  FileImport
} from "lucide-react";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <FileImport className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold tracking-tight">Import Genie</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center text-sm text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <Link to="/import" className="flex items-center text-sm text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                <FileImport className="w-4 h-4 mr-1" />
                Import
              </Link>
              <Link to="/settings" className="flex items-center text-sm text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center text-sm text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
              <Link to="/register" className="flex items-center text-sm text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
                <UserPlus className="w-4 h-4 mr-1" />
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm text-slate-600 dark:text-slate-300">
                {user?.username}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="default"
              size="sm"
              onClick={() => navigate("/login")}
              className="flex items-center"
            >
              <LogIn className="w-4 h-4 mr-1" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
