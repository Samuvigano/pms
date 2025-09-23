import {
  MessageCircle,
  BarChart3,
  AlertTriangle,
  LogOut,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/clerk-react";
import logo from "@/assets/logo.jpg";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
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
      icon: Ticket,
      label: "Tickets",
      path: "/tickets",
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
    <div className="w-16 bg-white text-black border-r border-black/5 flex flex-col">
      <div className="p-4 border-b border-black/5 flex items-center justify-center">
        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-black/10">
          <img src={logo} alt="iFlat Logo" className="w-6 h-6 object-contain" />
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full h-12 flex items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-zinc-50 text-black"
                  : "hover:bg-black/5 text-black/70 hover:text-black"
              )}
              aria-label={item.label}
              title={item.label}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 text-black",
                  isActive ? "[&_svg]:stroke-black [&_*]:fill-black" : ""
                )}
                strokeWidth={isActive ? 2.6 : 2}
              />
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-black/5 space-y-2">
        <Button
          variant="ghost"
          onClick={handleProfileClick}
          className={cn(
            "w-full h-12 flex items-center justify-center rounded-lg",
            location.pathname === "/profile"
              ? "bg-zinc-50 text-black"
              : "hover:bg-black/5 text-black/70 hover:text-black"
          )}
          aria-label="Profile"
          title="Profile"
        >
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-black text-white text-xs">
              {(
                user?.fullName?.charAt(0) ||
                user?.firstName?.charAt(0) ||
                user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
                "U"
              ).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full h-12 flex items-center justify-center rounded-lg hover:bg-black/5 text-black/70 hover:text-black"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
