
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Phone, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  serviceName: string;
  propertyName: string;
  guestName: string;
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: number;
  provider: string;
  guestPhone: string;
  specialRequests?: string;
}

const services: Service[] = [
  {
    id: '1',
    serviceName: 'Spa Massage',
    propertyName: 'Downtown Luxury Apartment',
    guestName: 'Sarah Johnson',
    date: 'Dec 16, 2024',
    time: '3:00 PM',
    duration: '90 minutes',
    status: 'confirmed',
    price: 180,
    provider: 'Wellness Spa Services',
    guestPhone: '+1 (555) 123-4567',
    specialRequests: 'Couples massage for anniversary'
  },
  {
    id: '2',
    serviceName: 'Private Chef',
    propertyName: 'Modern Penthouse Suite',
    guestName: 'David Thompson',
    date: 'Dec 15, 2024',
    time: '7:00 PM',
    duration: '3 hours',
    status: 'confirmed',
    price: 350,
    provider: 'Gourmet Chef Services',
    guestPhone: '+1 (555) 789-0123',
    specialRequests: 'Romantic dinner setup for honeymoon'
  },
  {
    id: '3',
    serviceName: 'City Tour Guide',
    propertyName: 'Cozy Studio near Central Park',
    guestName: 'Michael Chen',
    date: 'Dec 17, 2024',
    time: '10:00 AM',
    duration: '4 hours',
    status: 'pending',
    price: 120,
    provider: 'NYC Local Tours',
    guestPhone: '+1 (555) 987-6543'
  },
  {
    id: '4',
    serviceName: 'Laundry Service',
    propertyName: 'Spacious Family Apartment',
    guestName: 'Emma Rodriguez',
    date: 'Dec 14, 2024',
    time: '11:00 AM',
    duration: '2 hours',
    status: 'completed',
    price: 45,
    provider: 'QuickClean Laundry',
    guestPhone: '+1 (555) 456-7890'
  }
];

const Services = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = services
    .filter(s => s.status === 'completed' || s.status === 'confirmed')
    .reduce((sum, service) => sum + service.price, 0);

  const pendingServices = services.filter(s => s.status === 'pending').length;
  const confirmedServices = services.filter(s => s.status === 'confirmed').length;

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Services Booked</h2>
            <p className="text-gray-600">Manage all guest service bookings and appointments</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{confirmedServices}</div>
                <p className="text-xs text-muted-foreground">Services</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingServices}</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.propertyName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ${service.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">Guest:</span>
                        <span className="ml-1">{service.guestName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{service.guestPhone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{service.date} at {service.time}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-medium">Duration:</span>
                        <span className="ml-1">{service.duration}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Provider:</span>
                        <span className="ml-1">{service.provider}</span>
                      </div>
                    </div>
                  </div>

                  {service.specialRequests && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Special Requests:</span>
                      <p className="text-sm text-blue-800 mt-1">{service.specialRequests}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {service.status === 'pending' && (
                      <>
                        <Button size="sm">Confirm</Button>
                        <Button size="sm" variant="outline">Contact Provider</Button>
                      </>
                    )}
                    
                    {service.status === 'confirmed' && (
                      <>
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" variant="outline">Contact Guest</Button>
                      </>
                    )}
                    
                    {service.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">
                        Service Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
