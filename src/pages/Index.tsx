
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const Index: React.FC = () => {
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero onStartConverting={scrollToUpload} />
        <div ref={uploadSectionRef}>
          <FileUpload id="file-upload" />
        </div>
        <Features />
        
        {/* Backend setup info banner */}
        <div className="bg-any2pdf-teal/10 py-6">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-any2pdf-teal mr-2" />
                <p className="text-gray-700">
                  This is a frontend demo. To enable actual file conversion, you need to set up the Supabase backend.
                </p>
              </div>
              <Link to="/backend-setup">
                <Button variant="outline" className="border-any2pdf-teal text-any2pdf-teal hover:bg-any2pdf-teal hover:text-white">
                  View Backend Setup Instructions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
