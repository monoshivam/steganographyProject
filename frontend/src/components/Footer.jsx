import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-5 h-5 text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
            <p className="text-gray-300">
              For <span className="font-semibold text-blue-400">Cyber Security Subject</span>
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <p className="text-gray-400">Made with love</p>
            <span className="text-red-500 text-lg">❤️</span>
          </div>
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 Cyber Steganography Project. Educational purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;