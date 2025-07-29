import React from 'react';

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-5 shadow-sm rounded border border-gray-200">
      <h3 className="text-md font-medium text-gray-800 truncate">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  );
};

export default StatsCard;
