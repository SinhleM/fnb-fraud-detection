import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import UserList from '../components/UserList';
import FraudTransactionsList from '../components/FraudTransactionsList';
import TransactionFilters from '../components/TransactionFilters';
import UserDetailPage from './UserDetailPage';

import FraudTrendChart from '../components/FraudTrendChart';
import TransactionChart from '../components/TransactionChart';

// API fetching functions
const fetchUsers = () => fetch('http://127.0.0.1:8000/users').then(res => res.json());
const fetchTransactions = () => fetch('http://127.0.0.1:8000/transactions').then(res => res.json());

const Home = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: '',
    });

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
                fraud_score: parseFloat(tx.fraud_score)
            }));

            setUsers(usersData);
            setTransactions(processedTransactions);
            setFilteredTransactions(processedTransactions);
            setLastUpdated(new Date());
            console.log('📦 Fetched data:', { users: usersData.length, transactions: processedTransactions.length });
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

    useEffect(() => {
        let tempTransactions = transactions;

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            tempTransactions = tempTransactions.filter(tx => new Date(tx.timestamp) >= fromDate);
        }
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            tempTransactions = tempTransactions.filter(tx => new Date(tx.timestamp) <= toDate);
        }
        if (filters.minAmount) {
            const minAmount = parseFloat(filters.minAmount);
            tempTransactions = tempTransactions.filter(tx => tx.amount >= minAmount);
        }
        if (filters.maxAmount) {
            const maxAmount = parseFloat(filters.maxAmount);
            tempTransactions = tempTransactions.filter(tx => tx.amount <= maxAmount);
        }
        setFilteredTransactions(tempTransactions);
    }, [transactions, filters]);


    const handleUserClick = (user) => {
        const userTransactions = transactions.filter(tx => tx.user_id === user.user_id);
        setSelectedUserData({ user, transactions: userTransactions });
    };

    const handleBackToDashboard = () => {
        setSelectedUserData(null);
    };

    const totalTransactions = filteredTransactions.length;
    const fraudulentTxns = filteredTransactions.filter(tx => Number(tx.is_fraud) === 1).length;
    const fraudRate = totalTransactions > 0 ? ((fraudulentTxns / totalTransactions) * 100).toFixed(2) + '%' : '0.00%';

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
            <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
                <TransactionFilters filters={filters} setFilters={setFilters} />

                {/* Stats Cards Section - gap-8 removed */}
                <div className="grid grid-cols-1 lg:grid-cols-4 mb-8">
                    <StatsCard title="Total Users" value={users.length} />
                    <StatsCard title="Total Transactions" value={totalTransactions} />
                    <StatsCard title="Fraudulent Transactions" value={fraudulentTxns} />
                    <StatsCard title="Fraud Rate" value={fraudRate} />
                </div>

                {/* Charts Section - gap-8 and rounded-lg removed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
                    {/* removed rounded-lg */}
                    <div className="bg-white p-6 shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Monthly Transaction Volume</h2>
                        <TransactionChart data={filteredTransactions} />
                    </div>
                    {/* removed rounded-lg */}
                    <div className="bg-white p-6 shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Weekly Fraud Trend</h2>
                        <FraudTrendChart data={filteredTransactions.filter(tx => tx.is_fraud)} />
                    </div>
                </div>

                {/* UserList and FraudTransactionsList section - gap-8 removed */}
                <div className="grid grid-cols-1 xl:grid-cols-3">
                    <div className="xl:col-span-1">
                        <UserList users={users} transactions={transactions} onUserClick={handleUserClick} />
                    </div>
                    <div className="xl:col-span-2">
                        <FraudTransactionsList transactions={filteredTransactions.filter(tx => tx.is_fraud)} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;