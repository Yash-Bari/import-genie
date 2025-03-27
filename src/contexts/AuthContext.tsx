
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock API call - in a real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials
      const mockUser = {
        id: 1,
        username,
        email: `${username}@example.com`,
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Successfully logged in");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock API call - in a real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always succeed
      const mockUser = {
        id: Date.now(),
        username,
        email,
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
