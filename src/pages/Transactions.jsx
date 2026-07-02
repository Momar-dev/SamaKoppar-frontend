import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiArrowUpCircle, FiArrowDownCircle, FiRepeat, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import API from '../services/api';

const Transactions = () => {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('transfer'); // transfer, deposit, withdraw
  
  // Form fields
  const [sourceAcc, setSourceAcc] = useState('');
  const [destAcc, setDestAcc] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
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
      
      // Select source account from location state if passed, or default to first account
      const passedSource = location.state?.sourceAccount;
      if (passedSource && accountsData.some(a => a.accountNumber === passedSource)) {
        setSourceAcc(passedSource);
        fetchTransactions(passedSource);
      } else if (accountsData.length > 0) {
        setSourceAcc(accountsData[0].accountNumber);
        fetchTransactions(accountsData[0].accountNumber);
      }
    } catch (error) {
      console.error('Erreur chargement comptes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accNum) => {
    if (!accNum) return;
    setTxLoading(true);
    try {
      const res = await API.get(`/transactions/${accNum}`);
      setTransactions(res.data.data || []);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const handleSourceAccountChange = (e) => {
    const accNum = e.target.value;
    setSourceAcc(accNum);
    fetchTransactions(accNum);
    setMessage(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setDestAcc('');
    setAmount('');
    setDescription('');
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceAcc || !amount) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const payload = {
      sourceAccountNumber: sourceAcc,
      amount: parseFloat(amount),
      description: description || `${activeTab === 'deposit' ? 'Dépôt' : activeTab === 'withdraw' ? 'Retrait' : 'Virement'} de fonds`
    };

    if (activeTab === 'transfer') {
      if (!destAcc) {
        setMessage({ type: 'error', text: 'Veuillez renseigner le compte destinataire.' });
        setSubmitting(false);
        return;
      }
      payload.destinationAccountNumber = destAcc;
    }

    try {
      let endpoint = `/transactions/${activeTab}`;
      const res = await API.post(endpoint, payload);
      
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message || 'Opération réussie !' });
        setAmount('');
        setDestAcc('');
        setDescription('');
        
        // Refresh account list and transaction list
        await fetchAccounts();
      } else {
        setMessage({ type: 'error', text: res.data.message || 'Une erreur est survenue.' });
      }
    } catch (error) {
      console.error('Erreur transaction:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la communication avec le serveur.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAccountInfo = accounts.find(a => a.accountNumber === sourceAcc);

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Opérations & Transactions</h1>
          <p className="text-gray-500">Effectuez des virements, dépôts, retraits et consultez votre historique.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Formulaire de transaction */}
          <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
              <button
                onClick={() => handleTabChange('transfer')}
                className={`flex-1 py-3 text-center text-sm font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'transfer' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiRepeat size={16} /> Virement
              </button>
              <button
                onClick={() => handleTabChange('deposit')}
                className={`flex-1 py-3 text-center text-sm font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'deposit' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiArrowDownCircle size={16} /> Dépôt
              </button>
              <button
                onClick={() => handleTabChange('withdraw')}
                className={`flex-1 py-3 text-center text-sm font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'withdraw' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiArrowUpCircle size={16} /> Retrait
              </button>
            </div>

            {/* Notification messages */}
            {message && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Compte source */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Compte Débité (Source)</label>
                <select
                  value={sourceAcc}
                  onChange={handleSourceAccountChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountType === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'} ({acc.accountNumber}) - Solde: {acc.balance.toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
                {selectedAccountInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    Solde disponible sur ce compte : <span className="font-semibold text-primary">{selectedAccountInfo.balance.toLocaleString()} FCFA</span>
                  </p>
                )}
              </div>

              {/* Compte destinataire (Uniquement pour le virement) */}
              {activeTab === 'transfer' && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1.5">Numéro de Compte Destinataire</label>
                  <input
                    type="text"
                    value={destAcc}
                    onChange={(e) => setDestAcc(e.target.value)}
                    placeholder="Ex: 1000293847"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">Saisissez le numéro de compte du bénéficiaire.</p>
                </div>
              )}

              {/* Montant */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Montant (FCFA)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 50000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Motif / Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Virement loyer, Dépôt espèces..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                />
              </div>

              {/* Bouton de validation */}
              <button
                type="submit"
                disabled={submitting || !sourceAcc}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-md"
              >
                {submitting ? 'Traitement en cours...' : 
                  activeTab === 'transfer' ? 'Confirmer le virement' :
                  activeTab === 'deposit' ? 'Confirmer le dépôt' : 'Confirmer le retrait'}
              </button>
            </form>
          </div>

          {/* Mini Historique des transactions du compte sélectionné */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiRepeat className="text-primary" /> Historique récent
            </h2>
            
            {txLoading ? (
              <div className="text-center py-8 text-gray-500">Chargement...</div>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aucune opération récente.</p>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {transactions.slice(0, 10).map((tx) => {
                  const isDeposit = tx.transactionType === 'DEPOSIT';
                  const isTransferIn = tx.transactionType === 'TRANSFER' && tx.destinationAccountNumber === sourceAcc;
                  const isPositive = isDeposit || isTransferIn;
                  
                  return (
                    <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition border border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.transactionType === 'DEPOSIT' ? 'bg-green-50 text-green-600' :
                          tx.transactionType === 'WITHDRAWAL' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {tx.transactionType === 'DEPOSIT' ? <FiArrowDownCircle size={18} /> :
                           tx.transactionType === 'WITHDRAWAL' ? <FiArrowUpCircle size={18} /> : <FiRepeat size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 text-xs sm:text-sm line-clamp-1">{tx.description}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString('fr-FR')} - {tx.transactionReference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-xs sm:text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
