import React from 'react';

const FraudTransactionsList = ({ transactions }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Fraudulent Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.slice(0, 7).map((tx) => ( // Displaying top 7 for brevity
                            <tr key={tx.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{tx.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.user_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${parseFloat(tx.amount).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.merchant}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        ⚠️ Flagged
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FraudTransactionsList;