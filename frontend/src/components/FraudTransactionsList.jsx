// frontend/src/components/FraudTransactionsList.jsx
import React from 'react';

// ✅ This component displays the 7 most recent fraudulent transactions
const FraudTransactionsList = ({ transactions }) => {
    // Ensuring transactions is an array and sorting it.
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const recentFraudTransactions = safeTransactions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 7); // Still showing 7 by default, adjust if you want a similar "View More"

    return (
        <div className="bg-white p-4 border border-gray-200 flex flex-col flex-1 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Fraudulent Transactions</h2>

            <div className="overflow-x-auto flex-1 overflow-y-auto">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-gray-50 sticky top-0 z-10 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium text-gray-500">User</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Merchant</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Time</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentFraudTransactions.length > 0 ? (
                            recentFraudTransactions.map((tx) => (
                                <tr
                                    key={tx.transaction_id}
                                    className="transition-colors duration-200 ease-in-out hover:bg-teal-50 cursor-pointer"
                                >
                                    <td className="px-4 py-3">{tx.user_id}</td>
                                    <td className="px-4 py-3 font-medium">
                                        R {parseFloat(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">{tx.merchant}</td>
                                    <td className="px-4 py-3">{new Date(tx.timestamp).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        {/* MODIFIED: Gray with darker text */}
                                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md">
                                            ⚠ Fraud
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                                    No fraudulent transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FraudTransactionsList;