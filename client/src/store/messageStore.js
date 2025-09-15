
export const guests = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    room: '205',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    platform: 'Booking.com',
    checkIn: 'Dec 15, 2024',
    checkOut: 'Dec 18, 2024',
    guests: 2,
    specialRequests: 'Late check-in requested, anniversary celebration'
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'MC',
    room: '312',
    phone: '+1 (555) 987-6543',
    email: 'michael.chen@email.com',
    platform: 'Expedia',
    checkIn: 'Dec 14, 2024',
    checkOut: 'Dec 20, 2024',
    guests: 1,
    specialRequests: 'Business traveler, early breakfast needed'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'ER',
    room: '108',
    phone: '+1 (555) 456-7890',
    email: 'emma.rodriguez@email.com',
    platform: 'Booking.com',
    checkIn: 'Dec 16, 2024',
    checkOut: 'Dec 19, 2024',
    guests: 4,
    specialRequests: 'Family with children, connecting rooms preferred'
  },
  {
    id: '4',
    name: 'David Thompson',
    avatar: 'DT',
    room: '425',
    phone: '+1 (555) 789-0123',
    email: 'david.thompson@email.com',
    platform: 'Expedia',
    checkIn: 'Dec 13, 2024',
    checkOut: 'Dec 17, 2024',
    guests: 2,
    specialRequests: 'Honeymoon suite, champagne service requested'
  }
];

class MessageStore {
  constructor() {
    this.messages = {};
    this.aiEnabled = {};

    // Initialize with some sample messages
    this.addMessage('1', 'Hi! I just arrived at the hotel. What time is check-in?', 'guest');
    this.addMessage('1', 'Hello Sarah! Welcome to iFlat. Check-in is available from 3:00 PM. Since you mentioned a late check-in, we have your room ready whenever you arrive. Is there anything else I can help you with?', 'ai');
    
    this.addMessage('2', 'Good morning! Could you please arrange an early breakfast for tomorrow? I have an important meeting at 7 AM.', 'guest');
    this.addMessage('2', 'Good morning Michael! Absolutely, I can arrange an early breakfast for you. Our room service can deliver a continental breakfast to your room at 6:00 AM, or our restaurant opens early at 6:30 AM for business guests. Which would you prefer?', 'ai');
    
    this.addMessage('3', 'Hello! We are a family of 4 with two young children. Do you have connecting rooms available?', 'guest');
    
    this.addMessage('4', 'Hi there! This is our honeymoon trip. We heard about the champagne service - how can we arrange that?', 'guest');
    this.addMessage('4', 'Congratulations on your honeymoon, David! We would be delighted to arrange our champagne service for you. We can have a bottle of premium champagne with strawberries delivered to your suite this evening. Would 7 PM work for you?', 'ai');

    // Set initial AI status - some guests have AI enabled, others don't
    this.aiEnabled['1'] = true;
    this.aiEnabled['2'] = true;
    this.aiEnabled['3'] = false; // This guest needs manual attention
    this.aiEnabled['4'] = true;
  }

  addMessage(guestId, content, sender) {
    if (!this.messages[guestId]) {
      this.messages[guestId] = [];
    }

    const message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      sender,
      timestamp: new Date(),
      read: sender === 'staff' || sender === 'ai'
    };

    this.messages[guestId].push(message);

    // When staff responds, mark all previous guest messages as read
    if (sender === 'staff') {
      this.markAsRead(guestId);
    }

    // If AI is enabled and the message is from a guest, generate an AI response
    if (sender === 'guest' && this.aiEnabled[guestId]) {
      setTimeout(() => {
        this.generateAIResponse(guestId, content);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
  }

  generateAIResponse(guestId, guestMessage) {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    let aiResponse = '';

    // Generate contextual responses based on guest message and profile
    const message = guestMessage.toLowerCase();
    
    if (message.includes('check-in') || message.includes('arrival')) {
      aiResponse = `Hello ${guest.name}! Welcome to iFlat. Check-in is available from 3:00 PM. Your room ${guest.room} is ready for you. Is there anything special I can arrange for your stay?`;
    } else if (message.includes('breakfast') || message.includes('dining')) {
      aiResponse = `I'd be happy to help with dining arrangements! Our restaurant is open from 6:30 AM to 10:00 PM, and room service is available 24/7. Would you like me to make a reservation or send you our menu?`;
    } else if (message.includes('spa') || message.includes('massage')) {
      aiResponse = `Our spa offers a full range of treatments! I can check availability and make a booking for you. What type of treatment interests you most?`;
    } else if (message.includes('room') || message.includes('upgrade')) {
      aiResponse = `Let me check what options we have available for you. I'll review your booking and see what upgrades might be possible for your ${guest.checkIn} to ${guest.checkOut} stay.`;
    } else if (message.includes('transportation') || message.includes('airport')) {
      aiResponse = `I can certainly help arrange transportation! We offer airport shuttle service and can also arrange taxi or private car service. What would work best for you?`;
    } else {
      aiResponse = `Thank you for reaching out! I'm here to help make your stay at iFlat exceptional. Let me look into that for you right away.`;
    }

    this.addMessage(guestId, aiResponse, 'ai');
  }

  getMessages(guestId) {
    return this.messages[guestId] || [];
  }

  getLastMessage(guestId) {
    const messages = this.messages[guestId];
    return messages && messages.length > 0 ? messages[messages.length - 1] : null;
  }

  getUnreadCount(guestId) {
    const messages = this.messages[guestId] || [];
    return messages.filter(m => !m.read && m.sender === 'guest').length;
  }

  getTotalUnreadCount() {
    return guests.reduce((total, guest) => total + this.getUnreadCount(guest.id), 0);
  }

  markAsRead(guestId) {
    const messages = this.messages[guestId] || [];
    messages.forEach(m => {
      if (m.sender === 'guest') {
        m.read = true;
      }
    });
  }

  isAIEnabled(guestId) {
    return this.aiEnabled[guestId] || false;
  }

  toggleAI(guestId) {
    this.aiEnabled[guestId] = !this.aiEnabled[guestId];
    return this.aiEnabled[guestId];
  }

  getGuestStatus(guestId) {
    const hasUnread = this.getUnreadCount(guestId) > 0;
    const isAI = this.isAIEnabled(guestId);
    
    if (hasUnread && !isAI) return 'pending';
    if (isAI) return 'ai';
    return 'active';
  }
}

export const messageStore = new MessageStore();
