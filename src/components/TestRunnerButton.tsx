
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestRunnerButton: React.FC = () => {
  return (
    <Link to="/tests" target="_blank">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center space-x-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
      >
        <Play className="h-4 w-4" />
        <span>Executar Testes</span>
      </Button>
    </Link>
  );
};

export default TestRunnerButton;
