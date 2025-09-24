import {
  MessageCircle,
  BarChart3,
  AlertTriangle,
  Settings as SettingsIcon,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import logo from "@/assets/logo.jpg";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
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
        <div
          className={cn(
            "w-full h-12 flex items-center justify-center rounded-lg",
            "hover:bg-black/5"
          )}
          title="Account"
          aria-label="Account"
        >
          <UserButton
            afterSignOutUrl="/sign-in"
            userProfileMode="navigation"
            userProfileUrl="/settings/account"
            appearance={{
              elements: { userButtonAvatarBox: { width: 24, height: 24 } },
            }}
          />
        </div>

        <Button
          variant="ghost"
          onClick={handleSettingsClick}
          className={cn(
            "w-full h-12 flex items-center justify-center rounded-lg",
            location.pathname.startsWith("/settings")
              ? "bg-zinc-50 text-black"
              : "hover:bg-black/5 text-black/70 hover:text-black"
          )}
          aria-label="Settings"
          title="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
