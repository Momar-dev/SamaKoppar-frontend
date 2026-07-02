import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 text-center">
      <div className="max-w-md bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-24 h-24 bg-gold opacity-10 rounded-full" />
        
        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle size={40} />
        </div>
        
        {/* Error Code */}
        <h1 className="text-6xl font-black text-primary mb-2">404</h1>
        
        {/* Subtitle */}
        <h2 className="text-xl font-bold text-gray-800 mb-3">Page non trouvée</h2>
        
        {/* Message */}
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Veuillez vérifier l'adresse ou retourner à l'accueil.
        </p>
        
        {/* Action Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition shadow-md w-full justify-center"
        >
          <FiHome size={18} />
          Retour au Tableau de Bord
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
