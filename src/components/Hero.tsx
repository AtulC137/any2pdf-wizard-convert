
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onStartConverting: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartConverting }) => {
  return (
    <div className="relative bg-white pt-24 md:pt-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-20">
          <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 animate-fade-in">
              Convert <span className="text-any2pdf-teal">Anything</span> to PDF in Seconds
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Upload Word, Excel, Images, or any file and get a downloadable PDF instantly.
            </p>
            <Button 
              onClick={onStartConverting}
              className="bg-any2pdf hover:bg-any2pdf-dark text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-scale"
            >
              Start Converting 
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* Illustration */}
            <div className="w-full max-w-md mx-auto relative">
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gradient-to-br from-any2pdf-light/20 to-any2pdf-teal/20 rounded-full"></div>
                
                {/* Document Icons */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg">
                  <div className="w-10 h-12 bg-blue-100 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                    <div className="absolute top-4 left-2 w-6 h-1 bg-blue-300"></div>
                    <div className="absolute top-6 left-2 w-4 h-1 bg-blue-300"></div>
                    <div className="absolute top-8 left-2 w-5 h-1 bg-blue-300"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg">
                  <div className="w-10 h-12 bg-green-100 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                    <div className="grid grid-cols-2 gap-1 p-1 mt-2">
                      <div className="h-1 bg-green-300"></div>
                      <div className="h-1 bg-green-300"></div>
                      <div className="h-1 bg-green-300"></div>
                      <div className="h-1 bg-green-300"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2 bg-white p-2 rounded-lg shadow-lg">
                  <div className="w-10 h-12 bg-yellow-100 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500"></div>
                    <div className="absolute top-4 left-2 right-2 bottom-2 bg-yellow-300 rounded-sm"></div>
                  </div>
                </div>
                
                {/* PDF in center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-xl animate-pulse-scale">
                  <div className="w-16 h-20 bg-red-100 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-3 bg-red-500"></div>
                    <div className="absolute top-6 left-0 right-0 mx-auto w-10 h-2 bg-red-300"></div>
                    <div className="absolute top-10 left-0 right-0 mx-auto w-8 text-center text-xs font-bold text-red-500">PDF</div>
                    <div className="absolute bottom-2 left-0 right-0 mx-auto w-10 h-1 bg-red-300"></div>
                  </div>
                </div>
                
                {/* Arrows pointing to center */}
                <div className="absolute top-1/3 left-1/2 w-10 h-1 bg-gray-400 transform -translate-x-4 -translate-y-4 rotate-45"></div>
                <div className="absolute top-1/2 left-1/3 w-10 h-1 bg-gray-400 transform -translate-y-2"></div>
                <div className="absolute bottom-1/3 left-1/2 w-10 h-1 bg-gray-400 transform -translate-x-8 translate-y-4 -rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-any2pdf-light/10 to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-any2pdf-teal/5 to-transparent -z-10"></div>
    </div>
  );
};

export default Hero;
