import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/90 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">RealTokenize</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Revolutionizing real estate investment through blockchain technology.
              Making property investment accessible, liquid, and secure.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/token-listing" className="text-gray-400 hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/liquidity-pool" className="text-gray-400 hover:text-white">
                  Liquidity Pool
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/kyc-verification" className="text-gray-400 hover:text-white">
                  KYC Verification
                </Link>
              </li>
              <li>
                <Link to="/property-verification" className="text-gray-400 hover:text-white">
                  Property Verification
                </Link>
              </li>
              <li>
                <Link to="/fraud-prevention" className="text-gray-400 hover:text-white">
                  Fraud Prevention
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 RealTokenize. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;