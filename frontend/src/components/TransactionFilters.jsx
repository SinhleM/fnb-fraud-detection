import React from 'react';

const TransactionFilters = ({ onFilterChange, onRefresh, isRefreshing }) => {
    const handleInputChange = (e) => {
        onFilterChange({ [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Date Range */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">Date From</label>
                    <input type="date" name="dateFrom" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                     <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">Date To</label>
                    <input type="date" name="dateTo" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>

                {/* Amount Range */}
                <div>
                    <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">Min Amount</label>
                    <input type="number" name="minAmount" placeholder="0" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>
                <div>
                     <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">Max Amount</label>
                    <input type="number" name="maxAmount" placeholder="10000" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end">
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="w-full bg-black text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center"
                    >
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilters;