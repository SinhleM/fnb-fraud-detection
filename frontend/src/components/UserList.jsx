// frontend/src/components/UserList.jsx
import React, { useState } from 'react';
import { calculateRiskScore } from '../utils/calculateRiskScore';

const RiskBadge = ({ level }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const styles = {
        Low: "bg-green-200 text-green-800",
        Medium: "bg-yellow-200 text-yellow-800",
        High: "bg-red-200 text-red-800",
    };
    return <span className={`${baseClasses} ${styles[level] || styles.Low}`}>{level || 'Low'} Risk</span>;
};

const UserList = ({ users = [], transactions = [], onUserClick }) => {
    const [displayLimit, setDisplayLimit] = useState(10);
    const usersPerPage = 10;

    const safeUsers = Array.isArray(users) ? users : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const usersWithRisk = safeUsers.map(user => {
        const userId = Number(user.user_id);
        const userTransactions = safeTransactions.filter(tx => {
            if (tx.user_id === undefined || tx.user_id === null || isNaN(Number(tx.user_id))) {
                return false;
            }
            return Number(tx.user_id) === userId;
        });

        const risk = calculateRiskScore(userTransactions, safeTransactions);
        return { ...user, ...risk };
    }).sort((a, b) => b.score - a.score);

    const handleViewMore = () => {
        setDisplayLimit(prevLimit => prevLimit + usersPerPage);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Users by Risk Score</h2>
            <div className="flex-grow overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {/* Adjusted formatting for <tr> and <th> tags */}
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Balance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersWithRisk.slice(0, displayLimit).map(user => (
                            // Adjusted formatting for <tr> and <td> tags
                            <tr
                                key={user.user_id}
                                onClick={() => onUserClick && onUserClick(user)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    R{user.initial_balance ? user.initial_balance.toFixed(2) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{user.score.toFixed(0)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RiskBadge level={user.level} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {usersWithRisk.length > displayLimit && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleViewMore}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        View More Users
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserList;