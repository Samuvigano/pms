import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Phone,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import whatsappLogo from "@/assets/whatsapp.svg";
import airbnbLogo from "@/assets/airbnb.svg";
import bookingLogo from "@/assets/booking.svg";
import instagramLogo from "@/assets/instagram.svg";
import telegramLogo from "@/assets/telegram.svg";
import expediaLogo from "@/assets/expedia.svg";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  image?: string | null;
}

interface MessageCenterProps {
  selectedGuest: any | null;
  aiEnabled: boolean;
  onToggleAI: () => void;
}

export const MessageCenter = ({
  selectedGuest,
  aiEnabled,
  onToggleAI,
}: MessageCenterProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const platforms = [
    { id: "WhatsApp", icon: whatsappLogo },
    { id: "Airbnb", icon: airbnbLogo },
    { id: "Booking.com", icon: bookingLogo },
    { id: "Instagram", icon: instagramLogo },
    { id: "Telegram", icon: telegramLogo },
    { id: "Expedia", icon: expediaLogo },
  ];

  useEffect(() => {
    if (selectedGuest?.platform) {
      setSelectedPlatform(selectedGuest.platform);
    }
  }, [selectedGuest]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [selectedGuest, messages]);

  // Fetch messages when selected guest changes
  useEffect(() => {
    if (!selectedGuest) {
      setMessages([]);
      return;
    }
    async function fetchMessages() {
      try {
        const res = await fetch(
          `/api/v1/messages?id=${selectedGuest.phone}&password=${
            import.meta.env.VITE_API_PASSWORD
          }`
        );
        const data = await res.json();
        setMessages(
          data.map((msg: any) => ({
            id: msg.message_id,
            content: msg.text,
            sender: msg.direction === "inbound" ? "guest" : "staff",
            timestamp: new Date(msg.timestamp),
            image: msg.image || null,
          }))
        );
      } catch (e) {
        setMessages([]);
      }
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedGuest]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGuest) return;
    try {
      await fetch(
        `/api/v1/send?password=${import.meta.env.VITE_API_PASSWORD}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: selectedGuest.phone,
            text: newMessage.trim(),
          }),
        }
      );
      setNewMessage("");
      // Optionally, refresh messages immediately
      setTimeout(() => {
        // re-fetch messages
        fetch(
          `/api/v1/messages?id=${selectedGuest.phone}&password=${
            import.meta.env.VITE_API_PASSWORD
          }`
        )
          .then((res) => res.json())
          .then((data) =>
            setMessages(
              data.map((msg: any) => ({
                id: msg.message_id,
                content: msg.text,
                sender: msg.direction === "inbound" ? "guest" : "staff",
                timestamp: new Date(msg.timestamp),
                image: msg.image || null,
              }))
            )
          );
      }, 500);
    } catch (e) {
      // Optionally handle error
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!selectedGuest) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Select a conversation
          </h2>
          <p className="text-gray-600">
            Choose a guest from the list to start managing their conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedGuest.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {selectedGuest.name}
              </h2>
            </div>
          </div>
          {/* Right controls: selected platform, AI toggle, info */}
          <div className="flex items-center space-x-4">
            {selectedPlatform && (
              <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200" title={selectedPlatform} aria-label={selectedPlatform}>
                <img src={platforms.find((p) => p.id === selectedPlatform)?.icon || ""} alt={selectedPlatform} className="h-full w-full object-contain" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <Switch
                checked={aiEnabled}
                onCheckedChange={onToggleAI}
                className="data-[state=checked]:bg-blue-500"
              />
              <Bot className="h-4 w-4 text-blue-500" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setInfoOpen(true)}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "guest" ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  message.sender === "guest"
                    ? "bg-white text-gray-900 border border-gray-200"
                    : message.sender === "ai"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                )}
              >
                <div className="flex items-center space-x-1 mb-1">
                  {message.sender === "ai" && <Bot className="h-3 w-3" />}
                  {message.sender === "staff" && <User className="h-3 w-3" />}
                  <span className="text-xs opacity-75">
                    {message.sender === "guest"
                      ? "Guest"
                      : message.sender === "ai"
                      ? "AI Assistant"
                      : "Staff"}
                  </span>
                </div>
                {message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image}
                      alt="attachment"
                      className="max-w-full max-h-60 rounded"
                    />
                  </div>
                )}
                <p className="text-sm">
                  {message.content.split("\n").map((line, idx) => (
                    <span key={idx}>
                      {line}
                      {idx !== message.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {!aiEnabled && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Manual control active
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                AI responses are paused. You're now handling this conversation.
              </p>
            </div>
          )}
          <div className="flex space-x-2">
            <Textarea
              placeholder={
                aiEnabled
                  ? "AI will respond automatically..."
                  : "Type your message..."
              }
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={aiEnabled}
              className="flex-1 resize-none min-h-[40px] max-h-40"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={aiEnabled || !newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Sidebar */}
      <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
        <SheetContent side="right" className="w-[340px] sm:w-[380px]">
          <SheetHeader>
            <SheetTitle>Conversation info</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedGuest.avatar}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{selectedGuest.name}</div>
                <div className="text-xs text-gray-500">{selectedGuest.phone}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Room</div>
                <div className="text-sm font-medium">{selectedGuest.room}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Platform</div>
                <div className="text-sm font-medium">{selectedPlatform || selectedGuest.platform}</div>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">AI Status</div>
              <div className="mt-1">
                <Badge className={cn(
                  "flex items-center space-x-1",
                  aiEnabled
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                )}>
                  {aiEnabled ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  <span className="ml-1">{aiEnabled ? "AI Active" : "Manual Control"}</span>
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500 mb-2">Platforms</div>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id)}
                    className={cn(
                      "h-9 w-9 rounded-full overflow-hidden border transition",
                      selectedPlatform === p.id
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    title={p.id}
                    aria-label={p.id}
                  >
                    <img src={p.icon} alt={p.id} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center text-sm text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-gray-500" /> {selectedGuest.phone}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
