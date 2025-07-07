import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import TransactionChart from '../components/TransactionChart';
import FraudTrendChart from '../components/FraudTrendChart';
import UserList from '../components/UserList';
import FraudTransactionsList from '../components/FraudTransactionsList';

const Home = () => {
    const [transactions, setTransactions] = useState([]);
    const [fraudTransactions, setFraudTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTransactions: 0,
        fraudulentTransactions: 0,
        fraudRate: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, transactionsRes, fraudTransactionsRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/users'),
                    fetch('http://127.0.0.1:8000/transactions'),
                    fetch('http://127.0.0.1:8000/fraud-transactions'),
                ]);

                const usersData = await usersRes.json();
                const transactionsData = await transactionsRes.json();
                const fraudTransactionsData = await fraudTransactionsRes.json();

                setUsers(usersData);
                setTransactions(transactionsData);
                setFraudTransactions(fraudTransactionsData);

                const totalUsers = usersData.length;
                const totalTransactions = transactionsData.length;
                const fraudulentTransactions = fraudTransactionsData.length;
                const fraudRate = totalTransactions > 0 ? (fraudulentTransactions / totalTransactions) * 100 : 0;

                setStats({
                    totalUsers,
                    totalTransactions,
                    fraudulentTransactions,
                    fraudRate: fraudRate.toFixed(2) + '%',
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Handle error state in a real app
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <main className="p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Fraud Detection Dashboard</h1>
                        <p className="text-gray-500 mt-1">Real-time analysis of transaction fraud.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard title="Total Users" value={stats.totalUsers} />
                        <StatsCard title="Total Transactions" value={stats.totalTransactions} />
                        <StatsCard title="Fraudulent Transactions" value={stats.fraudulentTransactions} />
                        <StatsCard title="Fraud Rate (%)" value={stats.fraudRate} />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                           <h2 className="text-xl font-semibold mb-4">Monthly Transaction Volume</h2>
                           <TransactionChart data={transactions} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                           <h2 className="text-xl font-semibold mb-4">Weekly Fraud Trend</h2>
                           <FraudTrendChart data={fraudTransactions} />
                        </div>
                    </div>

                    {/* Data Tables */}
                    <div className="space-y-8">
                        <UserList users={users} />
                        <FraudTransactionsList transactions={fraudTransactions} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;