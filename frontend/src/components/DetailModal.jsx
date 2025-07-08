import React from 'react';

const DetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const { user, transactions } = data;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">{user.name}'s Details</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Transaction History</h3>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="min-w-full">
                            <tbody>
                                {transactions.map(tx => (
                                    <tr
                                        key={tx.transaction_id}
                                        className={`border-t ${String(tx.is_fraud) === "1" ? 'bg-red-50' : ''}`}
                                    >
                                        <td className="p-3 text-sm">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                        <td className="p-3 text-sm">{tx.merchant}</td>
                                        <td className="p-3 text-sm font-semibold text-right">
                                            ${parseFloat(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="p-3 text-right">
                                            {String(tx.is_fraud) === "1" && (
                                                <span className="text-red-600 font-bold">Fraud</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
