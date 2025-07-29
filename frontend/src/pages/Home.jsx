// frontend/src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import UserList from '../components/UserList';
import FraudTransactionsList from '../components/FraudTransactionsList';
import UserDetailPage from './UserDetailPage';
import FraudTrendChart from '../components/FraudTrendChart';
import TransactionChart from '../components/TransactionChart';

// API fetching functions
const fetchUsers = () =>
  fetch('http://127.0.0.1:8000/users').then(res => res.json());

const fetchTransactions = () =>
  fetch('http://127.0.0.1:8000/transactions').then(res => res.json());

const Home = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [usersData, transactionsData] = await Promise.all([
        fetchUsers(),
        fetchTransactions(),
      ]);

      const processedTransactions = transactionsData.map(tx => ({
        ...tx,
        is_fraud: Number(tx.is_fraud),
        amount: parseFloat(tx.amount),
        balance_before_txn: parseFloat(tx.balance_before_txn),
        balance_after_txn: parseFloat(tx.balance_after_txn),
        fraud_score: parseFloat(tx.fraud_score),
      }));

      setUsers(usersData);
      setTransactions(processedTransactions);
      setLastUpdated(new Date());

      console.log('📦 Fetched data:', {
        users: usersData.length,
        transactions: processedTransactions.length,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleUserClick = user => {
    const userTransactions = transactions.filter(
      tx => tx.user_id === user.user_id
    );
    setSelectedUserData({ user, transactions: userTransactions });
  };

  const handleBackToDashboard = () => {
    setSelectedUserData(null);
  };

  const totalTransactions = transactions.length;
  const fraudulentTxns = transactions.filter(
    tx => Number(tx.is_fraud) === 1
  ).length;

  const fraudRate =
    totalTransactions > 0
      ? ((fraudulentTxns / totalTransactions) * 100).toFixed(2) + '%'
      : '0.00%';

  if (selectedUserData) {
    return (
      <UserDetailPage
        user={selectedUserData.user}
        transactions={selectedUserData.transactions}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={fetchData}
      />

      <main className="flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          <StatsCard title="Total Users" value={users.length} />
          <StatsCard title="Total Transactions" value={totalTransactions} />
          <StatsCard title="Fraudulent Transactions" value={fraudulentTxns} />
          <StatsCard title="Fraud Rate" value={fraudRate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="bg-white p-6 shadow-md border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Transaction Volume
            </h2>
            <TransactionChart data={transactions} />
          </div>
          <div className="bg-white p-6 shadow-md border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">
              Weekly Fraud Trend
            </h2>
            <FraudTrendChart data={transactions.filter(tx => tx.is_fraud)} />
          </div>
        </div>

        {/* Ensure items-stretch is here, and h-full on children */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 items-stretch">
          <div className="xl:col-span-1 h-full"> {/* h-full remains here */}
            <UserList
              users={users}
              transactions={transactions}
              onUserClick={handleUserClick}
            />
          </div>
          <div className="xl:col-span-2 h-full"> {/* h-full remains here */}
            <FraudTransactionsList
              transactions={transactions.filter(tx => tx.is_fraud)}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;