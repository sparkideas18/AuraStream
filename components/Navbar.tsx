import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import { AppContext } from '../App';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">AuraStream</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
            >
              Pricing
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
            >
              Dashboard
            </Link>
            
            {user ? (
               <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-500">Hi, {user.name}</span>
                 <button onClick={logout} className="text-sm font-medium text-gray-900 hover:text-red-500 transition-colors">Sign Out</button>
               </div>
            ) : (
              <Link to="/pricing">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-gray-100 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link 
            to="/" 
            className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Home
          </Link>
          <Link 
            to="/pricing" 
            className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('/pricing') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Pricing
          </Link>
          <Link 
            to="/dashboard" 
            className={`block px-3 py-2 text-base font-medium rounded-md ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Dashboard
          </Link>
          {user ? (
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="px-3 py-2 text-sm text-gray-500">Signed in as {user.name}</div>
              <button 
                onClick={() => { logout(); }} 
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link 
                to="/pricing" 
                className="block w-full text-center px-3 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;