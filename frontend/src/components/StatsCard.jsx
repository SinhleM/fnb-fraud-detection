import React from 'react';

const StatsCard = ({ title, value }) => {
    return (
        // Added border to StatsCard
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-lg font-medium text-gray-500 truncate">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    );
};

export default StatsCard;