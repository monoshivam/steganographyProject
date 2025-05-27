import React from "react";
import config from "../config";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <div>
              <h1 className="text-xl font-bold">{config.appTitle}</h1>
              <p className="text-blue-100 text-xs">{config.appDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;