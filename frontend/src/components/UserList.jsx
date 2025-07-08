import React, { useState } from 'react';
import { calculateRiskScore } from '../utils/calculateRiskScore'; //

const RiskBadge = ({ level }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const styles = {
        Low: "bg-green-200 text-green-800", // Changed to green for Low
        Medium: "bg-yellow-200 text-yellow-800",
        High: "bg-red-200 text-red-800",
    };
    return <span className={`${baseClasses} ${styles[level] || styles.Low}`}>{level || 'Low'} Risk</span>;
};

const UserList = ({ users = [], transactions = [], onUserClick }) => {
    const [displayLimit, setDisplayLimit] = useState(10); // State for how many users to display initially
    const usersPerPage = 10; // Number of users to add when "View More" is clicked

    const safeUsers = Array.isArray(users) ? users : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const usersWithRisk = safeUsers.map(user => {
        // Ensure user_id is a number for consistent comparison
        const userId = Number(user.user_id);

        // Filter transactions ensuring both IDs are numbers for comparison
        const userTransactions = safeTransactions.filter(tx => {
            // Add a check to ensure tx.user_id is a valid number before comparison
            if (tx.user_id === undefined || tx.user_id === null || isNaN(Number(tx.user_id))) {
                return false;
            }
            return Number(tx.user_id) === userId;
        });

        const risk = calculateRiskScore(userTransactions, safeTransactions);
        return { ...user, ...risk };
    }).sort((a, b) => b.score - a.score); // Sort by risk score (descending)

    const handleViewMore = () => {
        setDisplayLimit(prevLimit => prevLimit + usersPerPage); //
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Users by Risk Score</h2>
            <div className="flex-grow overflow-y-auto"> {/* Removed overflow-x-auto to prevent horizontal scrolling */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersWithRisk.slice(0, displayLimit).map(user => ( // Slice based on displayLimit
                            <tr
                                key={user.user_id}
                                onClick={() => onUserClick && onUserClick(user)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{user.score.toFixed(0)}</td> {/* Format score */}
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