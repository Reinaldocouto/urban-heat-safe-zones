
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthRequiredAlertProps {
  message: string;
  feature: string;
}

const AuthRequiredAlert: React.FC<AuthRequiredAlertProps> = ({ message, feature }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Login necessário para {feature}
      </h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-center space-x-4">
        <Link to="/login">
          <Button className="bg-fiap-pink hover:bg-fiap-pink/90">
            <LogIn className="h-4 w-4 mr-2" />
            Fazer Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Criar Conta
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AuthRequiredAlert;
