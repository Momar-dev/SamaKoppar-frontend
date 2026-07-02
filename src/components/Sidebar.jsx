import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCreditCard, FiList, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: <FiHome size={20} /> },
    { path: '/accounts', label: 'Mes comptes', icon: <FiCreditCard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <FiList size={20} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-primary text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold">SAMAKOPPAR</h1>
        <p className="text-blue-300 text-sm">Mon Argent</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
          <FiUser size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
          <p className="text-blue-300 text-xs">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition duration-200 ${
              location.pathname === item.path
                ? 'bg-white text-primary font-semibold'
                : 'text-blue-200 hover:bg-blue-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl text-blue-200 hover:bg-red-600 hover:text-white transition duration-200 w-full"
        >
          <FiLogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;