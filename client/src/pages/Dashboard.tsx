
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MessageCenter } from '@/components/MessageCenter';
import { GuestList } from '@/components/GuestList';
import { Header } from '@/components/Header';
import { messageStore } from '@/store/messageStore';

const Dashboard = () => {
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState<{ [key: string]: boolean }>({});

  // Initialize AI enabled state from message store
  useEffect(() => {
    const initialAiState: { [key: string]: boolean } = {};
    ['1', '2', '3', '4'].forEach(guestId => {
      initialAiState[guestId] = messageStore.isAIEnabled(guestId);
    });
    setAiEnabled(initialAiState);
  }, []);

  const toggleAI = (guestId: string) => {
    const newState = messageStore.toggleAI(guestId);
    setAiEnabled(prev => ({
      ...prev,
      [guestId]: newState
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <GuestList 
            selectedGuest={selectedGuest}
            onSelectGuest={setSelectedGuest}
            aiEnabled={aiEnabled}
          />
          <MessageCenter 
            selectedGuest={selectedGuest}
            aiEnabled={aiEnabled[selectedGuest || ''] || false}
            onToggleAI={() => selectedGuest && toggleAI(selectedGuest)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
