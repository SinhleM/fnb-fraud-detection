import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import UserList from '../components/UserList';
import FraudTransactionsList from '../components/FraudTransactionsList';
import TransactionFilters from '../components/TransactionFilters';
import DetailModal from '../components/DetailModal';
import InProjectReadme from '../components/InProjectReadme'; // New Import

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
            const [usersData, transactionsData] = await Promise.all([fetchUsers(), fetchTransactions()]);

            // Normalize user_id types to Number for consistency
            const normUsers = usersData.map(u => ({ ...u, user_id: Number(u.user_id) }));
            const normTransactions = transactionsData.map(tx => ({ ...tx, user_id: Number(tx.user_id) }));

            setUsers(normUsers);
            setTransactions(normTransactions);
            setFilteredTransactions(normTransactions); // Initially show all
            setLastUpdated(new Date());

            console.log("Fetched users:", normUsers);
            console.log("Fetched transactions:", normTransactions);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(intervalId);
    }, [fetchData]);

    useEffect(() => {
        let result = transactions;
        if (filters.dateFrom) {
            result = result.filter(tx => new Date(tx.timestamp) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            result = result.filter(tx => new Date(tx.timestamp) <= new Date(filters.dateTo));
        }
        if (filters.minAmount) {
            result = result.filter(tx => parseFloat(tx.amount) >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
            result = result.filter(tx => parseFloat(tx.amount) <= parseFloat(filters.maxAmount));
        }
        setFilteredTransactions(result);
    }, [filters, transactions]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleUserClick = (user) => {
        console.log("Clicked user:", user);
        const userId = Number(user.user_id); // normalize

        const userTransactions = transactions.filter(tx => {
            return Number(tx.user_id) === userId;
        });

        console.log(`User ${userId} transactions count:`, userTransactions.length);
        setModalData({ user, transactions: userTransactions });
    };

    const closeModal = () => setModalData(null);

    const fraudulentTxns = filteredTransactions.filter(t => t.is_fraud).length;
    const totalTxns = filteredTransactions.length;
    const fraudRate = totalTxns > 0 ? ((fraudulentTxns / totalTxns) * 100).toFixed(2) + '%' : '0%';

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Fraud Dashboard</h1>
                    {lastUpdated && <p className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
                </div>

                <TransactionFilters onFilterChange={handleFilterChange} onRefresh={fetchData} isRefreshing={isRefreshing} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Total Users" value={users.length} />
                    <StatsCard title="Visible Transactions" value={totalTxns} />
                    <StatsCard title="Fraudulent Transactions" value={fraudulentTxns} />
                    <StatsCard title="Fraud Rate" value={fraudRate} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Monthly Transaction Volume</h2>
                        <TransactionChart data={filteredTransactions} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Weekly Fraud Trend</h2>
                        <FraudTrendChart data={filteredTransactions.filter(tx => tx.is_fraud)} />
                    </div>
                </div>

                {/* Main Content Grid: UserList on left, Fraud List + Readme on right */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8"> {/* Added mb-8 for spacing below this section */}
                    <div className="xl:col-span-1"> {/* UserList takes the first column */}
                        <UserList users={users} transactions={transactions} onUserClick={handleUserClick} />
                    </div>
                    <div className="xl:col-span-2 flex flex-col gap-8"> {/* This div takes the remaining two columns and stacks its children vertically */}
                        <FraudTransactionsList transactions={filteredTransactions.filter(tx => tx.is_fraud)} />
                        <InProjectReadme /> {/* Placed here to slot into the gap */}
                    </div>
                </div>
            </main>
            <Footer />
            <DetailModal isOpen={!!modalData} onClose={closeModal} data={modalData} />
        </div>
    );
};

export default Home;