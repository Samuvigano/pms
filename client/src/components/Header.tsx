
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold text-gray-900">iFlat Dashboard</h1>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Live
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={handleProfileClick}>
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
