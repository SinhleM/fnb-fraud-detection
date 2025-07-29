// frontend/src/components/UserList.jsx
import React, { useState } from 'react';
import { calculateRiskScore } from '../utils/calculateRiskScore';

const RiskBadge = ({ level }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const styles = {
        Low: "bg-gray-100 text-gray-700",
        Medium: "bg-yellow-100 text-yellow-800",
        High: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${styles[level] || styles.Low}`}>{level || 'Low'} Risk</span>;
};

const UserList = ({ users = [], transactions = [], onUserClick }) => {
    const safeUsers = Array.isArray(users) ? users : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const [visibleUserCount, setVisibleUserCount] = useState(5);
    const USERS_PER_LOAD = 5;

    const usersWithRisk = safeUsers.map(user => {
        const userIdStr = String(user.user_id).trim();
        const userTransactions = safeTransactions.filter(tx => String(tx.user_id).trim() === userIdStr);
        const { score, level } = calculateRiskScore(userTransactions, safeTransactions);
        return { ...user, score, level };
    });

    // Sort usersWithRisk by score from highest to lowest
    const sortedUsersWithRisk = [...usersWithRisk].sort((a, b) => b.score - a.score); // MODIFIED LINE

    const displayedUsers = sortedUsersWithRisk.slice(0, visibleUserCount); // MODIFIED LINE
    const hasMoreUsers = sortedUsersWithRisk.length > visibleUserCount; // MODIFIED LINE

    return (
        <div className="bg-white p-4 border border-gray-200 flex flex-col flex-1 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Users Overview</h2>
            <div className="overflow-x-auto flex-1 overflow-y-auto">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-gray-50 sticky top-0 z-10 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium text-gray-500">User</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Risk Score</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayedUsers.length > 0 ? (
                            displayedUsers.map(user => (
                                <tr
                                    key={user.user_id}
                                    onClick={() => onUserClick && onUserClick(user)}
                                    className="hover:bg-teal-50 transition cursor-pointer"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{user.score}</td>
                                    <td className="px-4 py-3">
                                        <RiskBadge level={user.level} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-4 py-4 text-center text-gray-400">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Change condition to use sortedUsersWithRisk.length */}
            {sortedUsersWithRisk.length > USERS_PER_LOAD && (
                <div className="mt-4 text-center">
                    {hasMoreUsers ? (
                        <button
                            onClick={() => setVisibleUserCount(prev => Math.min(prev + USERS_PER_LOAD, sortedUsersWithRisk.length))} // MODIFIED LINE
                            className="text-sm font-medium text-white bg-teal-600 px-4 py-2 rounded-md hover:bg-teal-700 transition"
                        >
                            View More ({sortedUsersWithRisk.length - visibleUserCount} remaining) {/* MODIFIED LINE */}
                        </button>
                    ) : (
                        <button
                            onClick={() => setVisibleUserCount(USERS_PER_LOAD)}
                            className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                        >
                            View Less
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserList;