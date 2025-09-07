// frontend/src/components/common/Header.tsx
import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ArtisanAI</h1>
                <p className="text-sm text-gray-500">Intelligent Business Growth Platform</p>
              </div>
            </div>
          </div>
          
          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="text-gray-400 hover:text-gray-500 relative">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </span>
            </button>
            
            {/* User menu dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium hidden md:block">Artisan User</span>
              </button>
              
              {/* Dropdown menu - you can implement this with a state for showing/hiding */}
              {/* 
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </a>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;