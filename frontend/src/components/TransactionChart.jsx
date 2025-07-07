import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionChart = ({ data }) => {
    const monthlyData = data.reduce((acc, curr) => {
        const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Transactions',
                data: Object.values(monthlyData),
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: '#000000',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#000',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e5e7eb', // gray-200
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return <Line options={options} data={chartData} />;
};

export default TransactionChart;