import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import UserList from '../components/UserList';
import FraudTransactionsList from '../components/FraudTransactionsList';
import TransactionFilters from '../components/TransactionFilters';
import DetailModal from '../components/DetailModal';

// Add these imports for the charts
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
    const [modalData, setModalData] = useState(null);
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

            // Ensure is_fraud is a number for calculations
            const processedTransactions = transactionsData.map(tx => ({
                ...tx,
                is_fraud: Number(tx.is_fraud),
                amount: parseFloat(tx.amount),
                balance_before_txn: parseFloat(tx.balance_before_txn),
                balance_after_txn: parseFloat(tx.balance_after_txn),
                fraud_score: parseFloat(tx.fraud_score) // Ensure fraud_score is a number
            }));

            setUsers(usersData);
            setTransactions(processedTransactions);
            setFilteredTransactions(processedTransactions); // Initialize filtered with all transactions
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
        // Set up interval to refresh data every 30 seconds
        const intervalId = setInterval(fetchData, 30000);
        return () => clearInterval(intervalId); // Clean up on unmount
    }, [fetchData]);

    // Apply filters
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
        // Filter transactions for the clicked user
        const userTransactions = transactions.filter(tx => tx.user_id === user.user_id);
        setModalData({ user, transactions: userTransactions });
    };

    const closeModal = () => {
        setModalData(null);
    };

    // Calculate overall stats
    const totalTransactions = filteredTransactions.length;
    const fraudulentTxns = filteredTransactions.filter(tx => Number(tx.is_fraud) === 1).length;
    const fraudRate = totalTransactions > 0 ? ((fraudulentTxns / totalTransactions) * 100).toFixed(2) + '%' : '0.00%';

    return (
        // Changed bg-gray-50 to bg-white for the entire page background
        <div className="min-h-screen bg-white flex flex-col">
            <Header
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={fetchData}
            />
            <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
                <TransactionFilters filters={filters} setFilters={setFilters} />

                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    {/* StatsCard components will get their border styling internally */}
                    <StatsCard title="Total Users" value={users.length} />
                    <StatsCard title="Total Transactions" value={totalTransactions} />
                    <StatsCard title="Fraudulent Transactions" value={fraudulentTxns} />
                    <StatsCard title="Fraud Rate" value={fraudRate} />
                </div>

                {/* Charts Section */}
                {/* Added border to chart containers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Monthly Transaction Volume</h2>
                        <TransactionChart data={filteredTransactions} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Weekly Fraud Trend</h2>
                        <FraudTrendChart data={filteredTransactions.filter(tx => tx.is_fraud)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-1">
                        {/* UserList component will get its border styling internally */}
                        <UserList users={users} transactions={transactions} onUserClick={handleUserClick} />
                    </div>
                    <div className="xl:col-span-2">
                        {/* FraudTransactionsList component will get its border styling internally */}
                        <FraudTransactionsList transactions={filteredTransactions.filter(tx => tx.is_fraud)} />
                    </div>
                </div>
            </main>
            <Footer />
            <DetailModal isOpen={!!modalData} onClose={closeModal} data={modalData} />
        </div>
    );
};

export default Home;