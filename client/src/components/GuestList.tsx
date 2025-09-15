import { useState, useEffect } from "react";
import { Search, Bot, User, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLATFORMS = ["Booking.com", "Airbnb", "Expedia"];
const NAMES = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Lee",
  "Maria Garcia",
  "David Kim",
  "Emma Brown",
  "Liam Wilson",
  "Olivia Martinez",
  "Noah Lee",
  "Sophia Chen",
  "Mason Clark",
  "Isabella Lewis",
  "Lucas Walker",
  "Mia Hall",
];

function getRandomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}
function getRandomPlatform() {
  return PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
}
function getRandomRoom() {
  return (100 + Math.floor(Math.random() * 400)).toString();
}
function getRandomDateRange() {
  const now = new Date();
  const checkIn = new Date(
    now.getTime() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000
  );
  const checkOut = new Date(
    checkIn.getTime() +
      (1 + Math.floor(Math.random() * 3)) * 24 * 60 * 60 * 1000
  );
  return {
    checkIn: checkIn.toISOString().slice(0, 10),
    checkOut: checkOut.toISOString().slice(0, 10),
  };
}
function getRandomAvatar(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getOrAssignName(phone: string) {
  const key = "guest_names";
  let map: Record<string, string> = {};
  try {
    map = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {}
  if (map[phone]) return map[phone];
  const name = getRandomName();
  map[phone] = name;
  localStorage.setItem(key, JSON.stringify(map));
  return name;
}

function getOrAssignPlatform(phone: string) {
  const key = "guest_platforms";
  let map: Record<string, string> = {};
  try {
    map = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {}
  if (map[phone]) return map[phone];
  const platform = getRandomPlatform();
  map[phone] = platform;
  localStorage.setItem(key, JSON.stringify(map));
  return platform;
}

function getOrAssignRoom(phone: string) {
  const key = "guest_rooms";
  let map: Record<string, string> = {};
  try {
    map = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {}
  if (map[phone]) return map[phone];
  const room = getRandomRoom();
  map[phone] = room;
  localStorage.setItem(key, JSON.stringify(map));
  return room;
}

function getOrAssignDateRange(phone: string) {
  const key = "guest_dates";
  let map: Record<string, { checkIn: string; checkOut: string }> = {};
  try {
    map = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {}
  if (map[phone]) return map[phone];
  const dateRange = getRandomDateRange();
  map[phone] = dateRange;
  localStorage.setItem(key, JSON.stringify(map));
  return dateRange;
}

interface GuestListProps {
  selectedGuest: any | null;
  onSelectGuest: (guest: any) => void;
  aiEnabled: { [key: string]: boolean };
}

export const GuestList = ({
  selectedGuest,
  onSelectGuest,
  aiEnabled,
}: GuestListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGuests() {
      try {
        const res = await fetch(
          `/api/v1/users?password=${import.meta.env.VITE_API_PASSWORD}`
        );
        const data = await res.json();
        // data: [{ _id: wa_id, lastMessage, lastTimestamp }]
        const enriched = data.map((user: any, idx: number) => {
          // Use backend-provided name if available, otherwise 'Unknown'
          const name = user.name && user.name.trim() ? user.name : "Unknown";
          const platform = getOrAssignPlatform(user.wa_id);
          const room = getOrAssignRoom(user.wa_id);
          const { checkIn, checkOut } = getOrAssignDateRange(user.wa_id);
          return {
            id: user.wa_id,
            phone: user.wa_id,
            name,
            avatar: getRandomAvatar(name),
            platform,
            room,
            checkIn,
            checkOut,
            lastMessage: user.lastMessage,
            lastTimestamp: user.lastTimestamp,
          };
        });
        // Sort by lastTimestamp descending (most recent first)
        enriched.sort((a, b) => {
          if (!a.lastTimestamp) return 1;
          if (!b.lastTimestamp) return -1;
          return (
            new Date(b.lastTimestamp).getTime() -
            new Date(a.lastTimestamp).getTime()
          );
        });
        setGuests(enriched);
      } catch (e) {
        setGuests([]);
      }
    }
    fetchGuests();
    const interval = setInterval(fetchGuests, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.room.includes(searchTerm) ||
      guest.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (ts: string) => {
    if (!ts) return "";
    const date = new Date(ts);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            onClick={() => onSelectGuest(guest)}
            className={cn(
              "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
              selectedGuest &&
                selectedGuest.id === guest.id &&
                "bg-blue-50 border-blue-200"
            )}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {guest.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {guest.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Room {guest.room}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {guest.platform}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate mb-2">
                  {guest.lastMessage || "No messages yet"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {guest.lastTimestamp
                      ? formatTimestamp(guest.lastTimestamp)
                      : ""}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {guest.checkIn} - {guest.checkOut}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
