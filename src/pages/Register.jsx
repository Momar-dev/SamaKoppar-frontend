import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', phone: '', address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.data.customer, res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'Prénom', icon: <FiUser size={18} />, type: 'text', placeholder: 'Votre prénom' },
    { name: 'lastName', label: 'Nom', icon: <FiUser size={18} />, type: 'text', placeholder: 'Votre nom' },
    { name: 'email', label: 'Email', icon: <FiMail size={18} />, type: 'email', placeholder: 'votre@email.com' },
    { name: 'password', label: 'Mot de passe', icon: <FiLock size={18} />, type: 'password', placeholder: '••••••••' },
    { name: 'phone', label: 'Téléphone', icon: <FiPhone size={18} />, type: 'text', placeholder: '+221 77 000 00 00' },
    { name: 'address', label: 'Adresse', icon: <FiMapPin size={18} />, type: 'text', placeholder: 'Votre adresse' },
  ];

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">SAMAKOPPAR</h1>
          <p className="text-gold text-lg mt-1">Mon Argent — Votre Banque de Confiance</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Ouvrir un compte</h2>
          <p className="text-gray-500 mb-6">Rejoignez SAMAKOPPAR Bank aujourd'hui</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="text-gray-700 text-sm font-medium mb-1 block">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {field.icon}
                  </span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-900 transition mt-6 disabled:opacity-50"
          >
            {loading ? 'Inscription...' : "Créer mon compte"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Déjà client ?{' '}
            <Link to="/" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;