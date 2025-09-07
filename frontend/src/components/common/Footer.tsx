// frontend/src/components/common/Footer.tsx
import React from 'react';
import { Heart, Globe, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">ArtisanAI</h3>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Empowering Indian artisans and small businesses with AI-powered tools for market expansion, 
              intelligent networking, and cultural storytelling.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>for Indian artisans</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Market Expansion</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Market Intelligence</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Smart Networking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Business Automation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Storytelling</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Contact Support</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Community</a></li>
            </ul>
            
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Mail className="h-4 w-4" />
                <span>support@artisanai.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+91-800-ARTISAN</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 ArtisanAI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Terms of Service</a>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;