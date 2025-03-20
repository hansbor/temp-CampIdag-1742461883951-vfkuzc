import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Settings, HelpCircle, LogOut, Compass, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Navbar() {
  const navigate = useNavigate();
  const isExplorerEnabled = localStorage.getItem('explorerEnabled') === 'true';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center hover:text-indigo-600">
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </Link>
            {isExplorerEnabled && (
              <Link to="/explorer" className="flex items-center hover:text-indigo-600">
                <Compass className="w-5 h-5 mr-1" />
                <span>Explorer</span>
              </Link>
            )}
            <Link to="/settings" className="flex items-center hover:text-indigo-600">
              <Settings className="w-5 h-5 mr-1" />
              <span>Settings</span>
            </Link>
            <Link to="/help" className="flex items-center hover:text-indigo-600">
              <HelpCircle className="w-5 h-5 mr-1" />
              <span>Help</span>
            </Link>
            <Link to="/image-book" className="flex items-center hover:text-indigo-600">
              <Image className="w-5 h-5 mr-1" />
              <span>Image Book</span>
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-5 h-5 mr-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
