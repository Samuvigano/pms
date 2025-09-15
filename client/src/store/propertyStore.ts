
export interface Guest {
  id: string;
  name: string;
  avatar: string;
  room: string;
  phone: string;
  email: string;
  platform: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  unreadMessages: number;
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  platform: string;
  totalGuests: number;
  unreadMessages: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  image: string;
  rating: number;
  checkIn?: string;
  checkOut?: string;
  knowledgeBase: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'guest' | 'staff' | 'ai';
  timestamp: Date;
  read: boolean;
}

const propertyGuests: { [propertyId: string]: Guest[] } = {
  '1': [
    {
      id: '1-1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      room: '205',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      platform: 'Airbnb',
      checkIn: 'Dec 15, 2024',
      checkOut: 'Dec 18, 2024',
      guests: 2,
      specialRequests: 'Anniversary celebration, late check-in',
      unreadMessages: 2,
      lastMessage: 'Thank you for the champagne! The room is beautiful.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '1-2',
      name: 'Michael Chen',
      avatar: 'MC',
      room: '312',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@email.com',
      platform: 'Airbnb',
      checkIn: 'Dec 14, 2024',
      checkOut: 'Dec 20, 2024',
      guests: 1,
      specialRequests: 'Business traveler, early breakfast',
      unreadMessages: 1,
      lastMessage: 'Could I get extra towels please?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 45)
    }
  ],
  '2': [
    {
      id: '2-1',
      name: 'Emma Rodriguez',
      avatar: 'ER',
      room: '108',
      phone: '+1 (555) 456-7890',
      email: 'emma.rodriguez@email.com',
      platform: 'Booking.com',
      checkIn: 'Dec 16, 2024',
      checkOut: 'Dec 19, 2024',
      guests: 4,
      specialRequests: 'Family with children',
      unreadMessages: 1,
      lastMessage: 'Is there a playground nearby for kids?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30)
    }
  ],
  '4': [
    {
      id: '4-1',
      name: 'David Thompson',
      avatar: 'DT',
      room: '425',
      phone: '+1 (555) 789-0123',
      email: 'david.thompson@email.com',
      platform: 'Airbnb',
      checkIn: 'Dec 13, 2024',
      checkOut: 'Dec 17, 2024',
      guests: 2,
      specialRequests: 'Honeymoon suite, champagne service',
      unreadMessages: 5,
      lastMessage: 'The Wi-Fi seems to be down in our room',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5)
    }
  ]
};

const propertyMessages: { [propertyId: string]: { [guestId: string]: Message[] } } = {
  '1': {
    '1-1': [
      {
        id: 'm1',
        content: 'Hi! We just arrived. The apartment is beautiful!',
        sender: 'guest',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true
      },
      {
        id: 'm2',
        content: 'Welcome to your downtown luxury apartment! We hope you enjoy your anniversary celebration. Is there anything special we can arrange for you?',
        sender: 'ai',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        read: true
      },
      {
        id: 'm3',
        content: 'Thank you for the champagne! The room is beautiful.',
        sender: 'guest',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false
      }
    ],
    '1-2': [
      {
        id: 'm4',
        content: 'Good morning! Could I get extra towels please?',
        sender: 'guest',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        read: false
      }
    ]
  },
  '2': {
    '2-1': [
      {
        id: 'm5',
        content: 'Hello! Is there a playground nearby for kids?',
        sender: 'guest',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false
      }
    ]
  },
  '4': {
    '4-1': [
      {
        id: 'm6',
        content: 'Hi there! This is our honeymoon trip.',
        sender: 'guest',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true
      },
      {
        id: 'm7',
        content: 'Congratulations! We have arranged a special honeymoon package for you.',
        sender: 'ai',
        timestamp: new Date(Date.now() - 1000 * 60 * 100),
        read: true
      },
      {
        id: 'm8',
        content: 'The Wi-Fi seems to be down in our room',
        sender: 'guest',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false
      }
    ]
  }
};

export const properties: Property[] = [
  {
    id: '1',
    name: 'Downtown Luxury Apartment',
    address: '123 Main St, New York, NY',
    platform: 'Airbnb',
    totalGuests: 4,
    unreadMessages: 3,
    status: 'occupied',
    image: '/lovable-uploads/f9a784f9-91fc-4f46-86cb-a53bcb76cfde.png',
    rating: 4.9,
    checkIn: 'Dec 15, 2024',
    checkOut: 'Dec 18, 2024',
    knowledgeBase: 'Downtown apartment with luxury amenities. Rooftop access available. 24/7 concierge. Pet-friendly. Check-in instructions: Key code is 1234#'
  },
  {
    id: '2',
    name: 'Cozy Studio near Central Park',
    address: '456 Park Ave, New York, NY',
    platform: 'Booking.com',
    totalGuests: 2,
    unreadMessages: 1,
    status: 'occupied',
    image: '/lovable-uploads/f9a784f9-91fc-4f46-86cb-a53bcb76cfde.png',
    rating: 4.7,
    checkIn: 'Dec 14, 2024',
    checkOut: 'Dec 20, 2024',
    knowledgeBase: 'Studio apartment with park view. Playground across the street. Family-friendly area. Grocery store 2 blocks away.'
  },
  {
    id: '3',
    name: 'Spacious Family Apartment',
    address: '789 Broadway, New York, NY',
    platform: 'VRBO',
    totalGuests: 6,
    unreadMessages: 0,
    status: 'vacant',
    image: '/lovable-uploads/f9a784f9-91fc-4f46-86cb-a53bcb76cfde.png',
    rating: 4.8,
    knowledgeBase: 'Large family apartment with 3 bedrooms. Kid-friendly with safety locks. Baby crib available upon request.'
  },
  {
    id: '4',
    name: 'Modern Penthouse Suite',
    address: '321 5th Ave, New York, NY',
    platform: 'Airbnb',
    totalGuests: 8,
    unreadMessages: 5,
    status: 'occupied',
    image: '/lovable-uploads/f9a784f9-91fc-4f46-86cb-a53bcb76cfde.png',
    rating: 4.6,
    checkIn: 'Dec 13, 2024',
    checkOut: 'Dec 17, 2024',
    knowledgeBase: 'Luxury penthouse with city views. Champagne service available. High-speed WiFi. Spa services can be arranged.'
  }
];

class PropertyStore {
  getProperties(): Property[] {
    return properties;
  }

  getProperty(id: string): Property | undefined {
    return properties.find(p => p.id === id);
  }

  getPropertyGuests(propertyId: string): Guest[] {
    return propertyGuests[propertyId] || [];
  }

  getPropertyMessages(propertyId: string, guestId: string): Message[] {
    return propertyMessages[propertyId]?.[guestId] || [];
  }

  addMessage(propertyId: string, guestId: string, content: string, sender: 'guest' | 'staff' | 'ai') {
    if (!propertyMessages[propertyId]) {
      propertyMessages[propertyId] = {};
    }
    if (!propertyMessages[propertyId][guestId]) {
      propertyMessages[propertyId][guestId] = [];
    }

    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      sender,
      timestamp: new Date(),
      read: sender !== 'guest'
    };

    propertyMessages[propertyId][guestId].push(message);
  }

  markMessagesAsRead(propertyId: string, guestId: string) {
    const messages = propertyMessages[propertyId]?.[guestId] || [];
    messages.forEach(m => {
      if (m.sender === 'guest') {
        m.read = true;
      }
    });
  }

  updateKnowledgeBase(propertyId: string, knowledgeBase: string) {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      property.knowledgeBase = knowledgeBase;
    }
  }

  getTotalUnreadMessages(): number {
    return properties.reduce((total, property) => total + property.unreadMessages, 0);
  }

  getOccupiedProperties(): Property[] {
    return properties.filter(p => p.status === 'occupied');
  }
}

export const propertyStore = new PropertyStore();
