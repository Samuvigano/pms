import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authData = localStorage.getItem("demoAuth");
    if (authData) {
      try {
        const { user, expiresAt } = JSON.parse(authData);
        const now = new Date().getTime();

        if (now < expiresAt) {
          // Token is still valid
          setIsAuthenticated(true);
          setUser(user);
        } else {
          // Token has expired
          logout();
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        logout();
      }
    }
    setIsLoading(false);
  };

  const login = (email, password) => {
    // Demo login: accept any email with password "1234"
    if (password === "1234") {
      const user = {
        email,
        name: email.split("@")[0], // Use email prefix as name
        role: "Property Manager",
      };

      // Set expiration to 24 hours from now
      const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;

      const authData = {
        user,
        expiresAt,
      };

      localStorage.setItem("demoAuth", JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser(user);

      return { success: true };
    } else {
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("demoAuth");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
