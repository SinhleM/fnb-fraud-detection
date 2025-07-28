import React from 'react';
import { calculateRiskScore } from '../utils/calculateRiskScore';

const RiskBadge = ({ level }) => {
    // Keep baseClasses as is, since rounding is for the badge itself, not the component container.
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const styles = {
        Low: "bg-gray-200 text-gray-800",
        Medium: "bg-yellow-200 text-yellow-800",
        High: "bg-red-200 text-red-800",
    };
    return <span className={`${baseClasses} ${styles[level] || styles.Low}`}>{level || 'Low'} Risk</span>;
};

const UserList = ({ users = [], transactions = [], onUserClick }) => {
    const safeUsers = Array.isArray(users) ? users : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const usersWithRisk = safeUsers.map(user => {
        const userIdStr = String(user.user_id).trim();

        const userTransactions = safeTransactions.filter(tx => {
            if (!tx.user_id) return false;
            return String(tx.user_id).trim() === userIdStr;
        });

        const { score, level } = calculateRiskScore(userTransactions, safeTransactions);
        return { ...user, score: score, level: level };
    });

    return (
        // Removed rounded-lg from the main container div
        <div className="bg-white p-6 shadow-md border border-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Users Overview</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersWithRisk.map(user => (
                            <tr
                                key={user.user_id}
                                onClick={() => onUserClick && onUserClick(user)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{user.score}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RiskBadge level={user.level} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;