import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Ticket Oblierator Example
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Automate your GitHub pull requests with AI-powered workflows
        </p>
        <Button size="lg" onClick={() => navigate('/auth')}>
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
