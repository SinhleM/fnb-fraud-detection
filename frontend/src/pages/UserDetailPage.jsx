import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserDetailPage = ({ user, transactions, onBack }) => {
    if (!user || !transactions) {
        return (
            // Changed bg-gray-50 to bg-white for the entire page background
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">No user data to display. Please go back to the dashboard.</p>
                <button onClick={onBack} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // --- User Summary Calculations ---
    const totalTransactions = transactions.length;
    const fraudulentTxns = transactions.filter(tx => Number(tx.is_fraud) === 1);
    const numFraudulent = fraudulentTxns.length;
    const totalAmountTransacted = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalFraudulentAmount = fraudulentTxns.reduce((sum, tx) => sum + tx.amount, 0);
    const averageTransactionAmount = totalTransactions > 0 ? totalAmountTransacted / totalTransactions : 0;

    // --- Chart Data Preparation ---
    const dailyTransactionVolume = transactions.reduce((acc, tx) => {
        const date = new Date(tx.timestamp).toLocaleDateString('en-CA');
        acc[date] = (acc[date] || 0) + tx.amount;
        return acc;
    }, {});

    const chartData = Object.keys(dailyTransactionVolume).sort().map(date => ({
        date,
        volume: dailyTransactionVolume[date],
    }));

    return (
        // Changed bg-gray-50 to bg-white for the entire page background
        <div className="min-h-screen bg-white flex flex-col">
            <header className="bg-white shadow-sm p-4 sm:p-6 md:p-8 flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    <button onClick={onBack} className="text-blue-500 hover:text-blue-700 mr-4">
                        &larr;
                    </button>
                    {user.name}'s Detailed Profile
                </h1>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Back to Dashboard
                </button>
            </header>

            <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
                {/* User Information Card - Added border */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">User Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p><span className="font-medium">User ID:</span> {user.user_id}</p>
                            <p><span className="font-medium">Name:</span> {user.name}</p>
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                            <p><span className="font-medium">Account Type:</span> {user.account_type}</p>
                        </div>
                        <div>
                            <p><span className="font-medium">Province:</span> {user.province}</p>
                            <p><span className="font-medium">Signup Date:</span> {user.signup_date}</p>
                            <p><span className="font-medium">Initial Balance:</span> R{user.initial_balance ? user.initial_balance.toFixed(2) : 'N/A'}</p>
                            <p><span className="font-medium">Current Risk Score:</span> <span className="font-bold">{user.score.toFixed(0)}</span> (<span className="font-bold">{user.level}</span>)</p>
                        </div>
                    </div>
                </div>

                {/* Transaction Summary Card - Added border */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Transaction Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
                        <p><span className="font-medium">Total Transactions:</span> {totalTransactions}</p>
                        <p><span className="font-medium">Fraudulent Transactions:</span> {numFraudulent}</p>
                        <p><span className="font-medium">Total Amount:</span> R{totalAmountTransacted.toFixed(2)}</p>
                        <p><span className="font-medium">Total Fraud Amount:</span> R{totalFraudulentAmount.toFixed(2)}</p>
                        <p><span className="font-medium">Avg. Transaction Amount:</span> R{averageTransactionAmount.toFixed(2)}</p>
                    </div>
                </div>

                {/* Transaction Volume Chart - Added border */}
                {chartData.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Daily Transaction Volume</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => `R${value.toFixed(2)}`} />
                                <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Detailed Transaction History Table - Added border */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Detailed Transaction History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bal. Before</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bal. After</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud?</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Score</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rules Applied</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.length > 0 ? (
                                    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(txn => (
                                        <tr key={txn.transaction_id} className={Number(txn.is_fraud) === 1 ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(txn.timestamp).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {txn.merchant}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {txn.type}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                                                R{txn.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                                R{txn.balance_before_txn !== undefined && txn.balance_before_txn !== null ? txn.balance_before_txn.toFixed(2) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                                R{txn.balance_after_txn !== undefined && txn.balance_after_txn !== null ? txn.balance_after_txn.toFixed(2) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {txn.channel}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {txn.location}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                {Number(txn.is_fraud) === 1 ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Fraud
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Clean
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                                {txn.fraud_score !== undefined && txn.fraud_score !== null ? txn.fraud_score : '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {txn.rules_applied || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="px-4 py-3 text-center text-sm text-gray-500">No transactions found for this user.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDetailPage;