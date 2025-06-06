
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentationButton: React.FC = () => {
  return (
    <Link to="/documentation" target="_blank">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center space-x-2 border-fiap-pink text-fiap-pink hover:bg-fiap-pink hover:text-white"
      >
        <FileText className="h-4 w-4" />
        <span>Documentação</span>
      </Button>
    </Link>
  );
};

export default DocumentationButton;
