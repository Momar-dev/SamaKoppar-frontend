import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-primary font-bold text-lg tracking-wider">SAMAKOPPAR</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold/20 text-primary rounded-full flex items-center justify-center font-bold text-sm">
              {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
              {user.firstName} {user.lastName}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
          >
            <FiLogOut size={14} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
