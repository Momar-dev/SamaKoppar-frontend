import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiPlus, FiCheckCircle, FiInfo } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import API from '../services/api';

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get('/accounts/my-accounts');
      const accountsData = res.data.data || [];
      setAccounts(accountsData);
      
      // Default to first account for transaction viewing if available
      if (accountsData.length > 0 && !selectedAccount) {
        handleSelectAccount(accountsData[0]);
      }
    } catch (error) {
      console.error('Erreur chargement des comptes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (account) => {
    setSelectedAccount(account);
    setTxLoading(true);
    try {
      const res = await API.get(`/transactions/${account.accountNumber}`);
      setTransactions(res.data.data || []);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const handleCreateAccount = async (type) => {
    setCreating(true);
    try {
      await API.post(`/accounts/create?accountType=${type}`);
      await fetchAccounts();
    } catch (error) {
      console.error('Erreur création compte:', error);
    } finally {
      setCreating(false);
    }
  };

  const getCardGradient = (type) => {
    if (type === 'CURRENT') {
      return 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900';
    }
    return 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950';
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mes Comptes Bancaires</h1>
            <p className="text-gray-500">Gérez vos comptes et visualisez vos détails de solde.</p>
          </div>
          
          {/* Boutons création de compte */}
          <div className="flex gap-3">
            {!accounts.find(a => a.accountType === 'CURRENT') && (
              <button
                onClick={() => handleCreateAccount('CURRENT')}
                disabled={creating}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-900 transition shadow-sm disabled:opacity-50"
              >
                <FiPlus size={18} /> Nouveau Compte Courant
              </button>
            )}
            {!accounts.find(a => a.accountType === 'SAVINGS') && (
              <button
                onClick={() => handleCreateAccount('SAVINGS')}
                disabled={creating}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
              >
                <FiPlus size={18} /> Nouveau Compte Épargne
              </button>
            )}
          </div>
        </div>

        {/* Grille des comptes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {accounts.map((account) => {
            const isSelected = selectedAccount?.id === account.id;
            return (
              <div 
                key={account.id}
                onClick={() => handleSelectAccount(account)}
                className={`cursor-pointer rounded-3xl p-6 text-white transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl ${getCardGradient(account.accountType)} ${
                  isSelected ? 'ring-4 ring-gold transform -translate-y-1' : 'hover:scale-[1.01]'
                }`}
              >
                {/* Décoration de carte */}
                <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-48 h-48 bg-white opacity-5 rounded-full" />
                <div className="absolute left-1/3 top-0 -translate-y-12 w-32 h-32 bg-white opacity-5 rounded-full" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-blue-200">
                      {account.accountType === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                    </span>
                    <h3 className="text-lg font-semibold mt-1">SAMAKOPPAR Bank</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    account.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {account.status}
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-xs text-blue-200 uppercase tracking-widest mb-1">Numéro de compte</p>
                  <p className="text-xl font-mono tracking-wider">{account.accountNumber}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-blue-200 uppercase tracking-widest mb-1">Solde disponible</p>
                    <p className="text-3xl font-bold">
                      {account.balance.toLocaleString()} <span className="text-lg font-normal">FCFA</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gold font-semibold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <FiCheckCircle size={14} /> Sécurisé
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Détails du compte sélectionné */}
        {selectedAccount ? (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiCreditCard className="text-primary" />
                  Mouvements : {selectedAccount.accountType === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                </h2>
                <p className="text-sm text-gray-400 font-mono mt-0.5">{selectedAccount.accountNumber}</p>
              </div>
              <button 
                onClick={() => navigate('/transactions', { state: { sourceAccount: selectedAccount.accountNumber } })}
                className="bg-gray-100 hover:bg-gray-200 text-primary px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Faire une transaction
              </button>
            </div>

            {/* Liste des transactions */}
            {txLoading ? (
              <div className="text-center py-12 text-gray-500">Chargement des transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
                <FiInfo size={24} className="text-gray-400" />
                <p>Aucune transaction enregistrée pour ce compte.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="py-3 font-semibold">Description</th>
                      <th className="py-3 font-semibold">Date</th>
                      <th className="py-3 font-semibold">Référence</th>
                      <th className="py-3 font-semibold">Type</th>
                      <th className="py-3 font-semibold text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {transactions.map((tx) => {
                      const isDeposit = tx.transactionType === 'DEPOSIT';
                      const isTransferIn = tx.transactionType === 'TRANSFER' && tx.destinationAccountNumber === selectedAccount.accountNumber;
                      const isPositive = isDeposit || isTransferIn;
                      
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition">
                          <td className="py-4 font-medium text-gray-700">{tx.description}</td>
                          <td className="py-4 text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          <td className="py-4 font-mono text-xs text-gray-400">{tx.transactionReference}</td>
                          <td className="py-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              tx.transactionType === 'DEPOSIT' ? 'bg-green-50 text-green-700' :
                              tx.transactionType === 'WITHDRAWAL' ? 'bg-red-50 text-red-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {tx.transactionType === 'DEPOSIT' ? 'Dépôt' :
                               tx.transactionType === 'WITHDRAWAL' ? 'Retrait' : 'Virement'}
                            </span>
                          </td>
                          <td className={`py-4 text-right font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            <FiCreditCard size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">Aucun compte actif</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Veuillez créer un compte courant ou d'épargne ci-dessus pour commencer vos opérations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
