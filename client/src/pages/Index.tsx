import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MessageCenter } from "@/components/MessageCenter";
import { GuestList } from "@/components/GuestList";

const Index = () => {
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [aiEnabled, setAiEnabled] = useState<{ [key: string]: boolean }>({});

  const toggleAI = (guestId: string) => {
    setAiEnabled((prev) => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <GuestList
            selectedGuest={selectedGuest}
            onSelectGuest={setSelectedGuest}
            aiEnabled={aiEnabled}
          />
          <MessageCenter
            selectedGuest={selectedGuest}
            aiEnabled={
              selectedGuest ? aiEnabled[selectedGuest.id] || false : false
            }
            onToggleAI={() => selectedGuest && toggleAI(selectedGuest.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
