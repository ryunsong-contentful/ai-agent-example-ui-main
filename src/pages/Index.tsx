import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen max-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 overflow-hidden relative">
      {/* Main Content - Centered */}
      <div className="max-w-4xl mx-auto z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Text Content */}
          <div className="space-y-3">
            {/* Team Name - 40% Most Prominent */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ONE NATION ARMY
              </span>
            </h1>

            {/* Project Title - 35% */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-800">
              Ticket Obliterator
            </h2>

            {/* Creator Name - 25% */}
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-700">
              by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Ryun Song</span>
            </p>
          </div>

          {/* Description and CTA */}
          <div className="space-y-4 pt-4">
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-light">
              AI-Powered Workflows for GitHub Pull Requests
            </p>

            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-5 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image - Positioned on the right side */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="/ryun-photo.jpg" 
              alt="Ryun Song" 
              className="w-56 h-56 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute top-5 left-5 w-72 h-72 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-5 right-5 w-72 h-72 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl"></div>
    </div>
  );
};

export default Index;
