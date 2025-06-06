
import React, { useState } from 'react';
import { Settings, Eye, EyeOff, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TestRunnerButton from './TestRunnerButton';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isVisible && (
        <Card className="mb-2 w-64">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              DevTools
            </h3>
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Ambiente:</strong> {import.meta.env.MODE}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Versão:</strong> 1.0.0
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/documentation" target="_blank" className="flex-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs border-fiap-red text-fiap-red hover:bg-fiap-red hover:text-white"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Documentação
                  </Button>
                </Link>
                <div className="flex-1">
                  <TestRunnerButton />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={toggleVisibility}
        size="sm"
        variant="outline"
        className="bg-white shadow-lg hover:shadow-xl border-fiap-red text-fiap-red hover:bg-fiap-red hover:text-white"
      >
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default DevTools;
