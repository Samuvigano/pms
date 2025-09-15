import {
  MessageCircle,
  BarChart3,
  AlertTriangle,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { messageStore } from "@/store/messageStore";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
  };

  const totalUnreadMessages = 0;
  const escalationsCount = 0;

  const menuItems = [
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/",
      notifications: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: AlertTriangle,
      label: "Escalations",
      path: "/escalations",
      notifications: escalationsCount > 0 ? escalationsCount : undefined,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
            <img
              src={logo}
              alt="iFlat Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">iFlat</h2>
            <p className="text-sm text-gray-500">Property Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50",
              location.pathname === item.path
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.notifications && item.notifications > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.notifications}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-4">
        {/* AI Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            AI Status
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Active & Learning</span>
          </div>
        </div>

        {/* User Profile */}
        <Button
          variant="ghost"
          onClick={handleProfileClick}
          className={cn(
            "w-full flex items-center space-x-3 p-3 rounded-lg justify-start hover:bg-gray-50",
            location.pathname === "/profile"
              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500">
              {user?.role || "Property Manager"}
            </p>
          </div>
        </Button>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg justify-start hover:bg-red-50 text-red-600 hover:text-red-700"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
};
