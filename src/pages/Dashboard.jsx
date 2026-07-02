import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiArrowUpCircle, FiArrowDownCircle, FiRepeat, FiPlus } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accountsRes = await API.get('/accounts/my-accounts');
      setAccounts(accountsRes.data.data || []);

      if (accountsRes.data.data && accountsRes.data.data.length > 0) {
        const txRes = await API.get(`/transactions/${accountsRes.data.data[0].accountNumber}`);
        setTransactions(txRes.data.data?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (type) => {
    setCreating(true);
    try {
      await API.post(`/accounts/create?accountType=${type}`);
      fetchData();
    } catch (error) {
      console.error('Erreur création compte:', error);
    } finally {
      setCreating(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const getTransactionIcon = (type) => {
    if (type === 'DEPOSIT') return <FiArrowDownCircle size={20} className="text-green-500" />;
    if (type === 'WITHDRAWAL') return <FiArrowUpCircle size={20} className="text-red-500" />;
    return <FiRepeat size={20} className="text-blue-500" />;
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Bonjour, {user?.firstName} !
          </h1>
          <p className="text-gray-500">Bienvenue sur votre espace SAMAKOPPAR Bank</p>
        </div>

        {/* Solde total */}
        <div className="bg-primary rounded-2xl p-6 text-white mb-6">
          <p className="text-blue-200 mb-1">Solde total</p>
          <h2 className="text-4xl font-bold">
            {totalBalance.toLocaleString()} <span className="text-xl">FCFA</span>
          </h2>
          <p className="text-blue-200 mt-2">{accounts.length} compte(s) actif(s)</p>
        </div>

        {/* Comptes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Mes comptes</h2>
            <div className="flex gap-2">
              {!accounts.find(a => a.accountType === 'CURRENT') && (
                <button
                  onClick={() => createAccount('CURRENT')}
                  disabled={creating}
                  className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-900 transition"
                >
                  <FiPlus size={14} /> Courant
                </button>
              )}
              {!accounts.find(a => a.accountType === 'SAVINGS') && (
                <button
                  onClick={() => createAccount('SAVINGS')}
                  disabled={creating}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                >
                  <FiPlus size={14} /> Épargne
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiCreditCard size={20} className="text-primary" />
                    <span className="font-semibold text-gray-700">
                      {account.accountType === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {account.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-2">{account.accountNumber}</p>
                <p className="text-2xl font-bold text-primary">
                  {account.balance.toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Dernières transactions</h2>
            <button
              onClick={() => navigate('/transactions')}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Voir tout
            </button>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune transaction pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(tx.transactionType)}
                    <div>
                      <p className="font-medium text-gray-700 text-sm">{tx.description}</p>
                      <p className="text-gray-400 text-xs">{tx.transactionReference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      tx.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.transactionType === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;