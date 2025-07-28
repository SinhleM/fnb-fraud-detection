import React, { useState } from 'react';

const FraudTransactionsList = ({ transactions = [] }) => {
    const [displayLimit, setDisplayLimit] = useState(10); // State for limiting displayed transactions
    const transactionsPerPage = 10; // Number of transactions to add per "View More" click

    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    // Log received transactions for debugging
    console.log('📦 Received fraud transactions:', safeTransactions);

    const handleViewMore = () => {
        setDisplayLimit(prevLimit => prevLimit + transactionsPerPage);
    };

    return (
        // Added border to FraudTransactionsList component
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Fraudulent Transactions</h2>
            <div className="flex-grow overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rules Applied</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Score</th> {/* Added Fraud Score header */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {safeTransactions.length > 0 ? (
                            safeTransactions
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by latest transactions
                                .slice(0, displayLimit) // Apply display limit
                                .map(transaction => (
                                    <tr key={transaction.transaction_id} className="bg-red-50 hover:bg-red-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(transaction.timestamp).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R{transaction.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.merchant}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.rules_applied || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.fraud_score ? transaction.fraud_score.toFixed(0) : 'N/A'}</td> {/* Display Fraud Score */}
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    No fraudulent transactions to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {safeTransactions.length > displayLimit && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleViewMore}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        View More Fraud
                    </button>
                </div>
            )}
        </div>
    );
};

export default FraudTransactionsList;