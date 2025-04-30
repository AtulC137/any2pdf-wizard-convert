
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img 
                src="/lovable-uploads/defd1888-b0c1-402a-b3d2-ab7387ceb6c6.png" 
                alt="Any2PDF Logo" 
                className="h-10"
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#" className="text-gray-700 hover:text-any2pdf-teal transition-colors duration-200">Home</a>
            <a href="#" className="text-gray-700 hover:text-any2pdf-teal transition-colors duration-200">About</a>
            <a href="#" className="text-gray-700 hover:text-any2pdf-teal transition-colors duration-200">Contact</a>
            <Button variant="outline" className="border-any2pdf-teal text-any2pdf-teal hover:bg-any2pdf-teal hover:text-white transition-colors duration-200">
              Login
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4 animate-fade-in">
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Home</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">About</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Contact</a>
            <div className="px-4 pt-2">
              <Button className="w-full bg-any2pdf hover:bg-any2pdf-dark text-white transition-colors duration-200">
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
