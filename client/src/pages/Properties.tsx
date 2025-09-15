
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyMessages } from '@/components/PropertyMessages';
import { propertyStore } from '@/store/propertyStore';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Properties = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const properties = propertyStore.getProperties();

  const handleBackToProperties = () => {
    setSelectedProperty(null);
  };

  if (selectedProperty) {
    return (
      <div className="flex h-screen bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-white">
              <Button 
                variant="ghost" 
                onClick={handleBackToProperties}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900">
                {propertyStore.getProperty(selectedProperty)?.name}
              </h2>
            </div>
            <PropertyMessages propertyId={selectedProperty} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Properties</h2>
            <p className="text-gray-600">Manage all your rental properties and guest communications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={setSelectedProperty}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
