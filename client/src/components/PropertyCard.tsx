
import { Property } from '@/store/propertyStore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Users, Star, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
}

export const PropertyCard = ({ property, onSelect }: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Airbnb': return 'bg-red-100 text-red-800';
      case 'Booking.com': return 'bg-blue-100 text-blue-800';
      case 'VRBO': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onSelect(property.id)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{property.name}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.address}</span>
            </div>
          </div>
          {property.unreadMessages > 0 && (
            <Badge className="bg-red-500 text-white">
              {property.unreadMessages}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge className={getPlatformColor(property.platform)}>
            {property.platform}
          </Badge>
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
        </div>

        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-32 object-cover rounded-lg"
        />
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{property.totalGuests} guests</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>{property.rating}</span>
          </div>
        </div>
        
        {property.status === 'occupied' && (
          <div className="mt-3 text-sm text-gray-600">
            <div>Check-in: {property.checkIn}</div>
            <div>Check-out: {property.checkOut}</div>
          </div>
        )}
        
        <div className="mt-3 flex items-center text-sm">
          <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
          <span className="text-blue-600">
            {property.unreadMessages > 0 
              ? `${property.unreadMessages} new messages`
              : 'No new messages'
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
