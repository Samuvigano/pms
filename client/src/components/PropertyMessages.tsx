import { useState, useEffect } from "react";
import { propertyStore, Guest, Message } from "@/store/propertyStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, MessageCircle, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PropertyMessagesProps {
  propertyId: string;
}

export const PropertyMessages = ({ propertyId }: PropertyMessagesProps) => {
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState("");

  const property = propertyStore.getProperty(propertyId);

  useEffect(() => {
    const propertyGuests = propertyStore.getPropertyGuests(propertyId);
    setGuests(propertyGuests);
    if (propertyGuests.length > 0 && !selectedGuest) {
      setSelectedGuest(propertyGuests[0].id);
    }
    if (property) {
      setKnowledgeBase(property.knowledgeBase);
    }
  }, [propertyId, property]);

  useEffect(() => {
    if (selectedGuest) {
      const guestMessages = propertyStore.getPropertyMessages(
        propertyId,
        selectedGuest
      );
      setMessages(guestMessages);
      propertyStore.markMessagesAsRead(propertyId, selectedGuest);
    }
  }, [propertyId, selectedGuest]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGuest) return;

    propertyStore.addMessage(propertyId, selectedGuest, newMessage, "staff");
    setMessages(propertyStore.getPropertyMessages(propertyId, selectedGuest));
    setNewMessage("");
  };

  const handleSaveKnowledgeBase = () => {
    propertyStore.updateKnowledgeBase(propertyId, knowledgeBase);
    setShowKnowledgeBase(false);
  };

  const selectedGuestInfo = guests.find((g) => g.id === selectedGuest);

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="flex h-full bg-white">
      {/* Guest List Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Property Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{property.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">{property.address}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800">
              {property.status}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {property.platform}
            </Badge>
          </div>
        </div>

        {/* Knowledge Base Section */}
        {showKnowledgeBase && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <h4 className="font-medium text-sm mb-2">
              Property Knowledge Base
            </h4>
            <Textarea
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              placeholder="Add property-specific information for AI responses..."
              className="mb-2 text-sm"
              rows={4}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveKnowledgeBase}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowKnowledgeBase(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Guests List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 text-sm">
              Active Guests ({guests.length})
            </h4>
          </div>
          {guests.map((guest) => (
            <Card
              key={guest.id}
              className={`m-2 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedGuest === guest.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => setSelectedGuest(guest.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                    {guest.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-sm text-gray-900 truncate">
                      {guest.name}
                    </h5>
                    {guest.unreadMessages > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {guest.unreadMessages}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">Room {guest.room}</p>
                  {guest.lastMessage && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {guest.lastMessage}
                    </p>
                  )}
                  {guest.lastMessageTime && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(guest.lastMessageTime, {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedGuestInfo ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {selectedGuestInfo.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedGuestInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Room {selectedGuestInfo.room} • {selectedGuestInfo.platform}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {selectedGuestInfo.guests} guests
                </Badge>
                <Badge variant="outline">
                  {selectedGuestInfo.checkIn} - {selectedGuestInfo.checkOut}
                </Badge>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "guest" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md items-start gap-3 ${
                    message.sender === "guest" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={`text-xs ${
                        message.sender === "guest"
                          ? "bg-blue-100 text-blue-700"
                          : message.sender === "ai"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message.sender === "guest" ? (
                        selectedGuestInfo.avatar
                      ) : message.sender === "ai" ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`${
                      message.sender === "guest" ? "text-left" : "text-right"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 text-sm ${
                        message.sender === "guest"
                          ? "bg-white text-gray-900 border border-gray-200"
                          : message.sender === "ai"
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {message.content.split("\n").map((line, idx) => (
                        <span key={idx}>
                          {line}
                          {idx !== message.content.split("\n").length - 1 && (
                            <br />
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(message.timestamp, {
                        addSuffix: true,
                      })}
                      {message.sender === "ai" && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <Textarea
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
                placeholder="Type your message..."
                className="flex-1 resize-none min-h-[40px] max-h-40"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No guests to show
            </h3>
            <p className="text-gray-600">
              This property has no active guests at the moment
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
