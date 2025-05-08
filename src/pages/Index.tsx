
import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
