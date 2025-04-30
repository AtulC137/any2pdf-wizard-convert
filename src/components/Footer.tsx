
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/defd1888-b0c1-402a-b3d2-ab7387ceb6c6.png" 
                alt="Any2PDF Logo" 
                className="h-8 mr-3"
              />
              <span className="text-lg font-semibold text-gray-800">Any2PDF</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Convert any file to PDF in seconds.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2 text-sm">
            <a href="#" className="text-gray-600 hover:text-any2pdf-teal transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-any2pdf-teal transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-any2pdf-teal transition-colors">
              GitHub
            </a>
            <a href="#" className="text-gray-600 hover:text-any2pdf-teal transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Any2PDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
