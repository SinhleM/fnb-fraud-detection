import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `Week ${weekNo}`;
};

const FraudTrendChart = ({ data }) => {
    const weeklyData = data.reduce((acc, curr) => {
        const dateObj = new Date(curr.timestamp);
        if (isNaN(dateObj)) return acc; // skip invalid date
        const week = getWeekNumber(dateObj);
        acc[week] = (acc[week] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(weeklyData),
        datasets: [
            {
                label: 'Fraudulent Transactions',
                data: Object.values(weeklyData),
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
                    color: '#e5e7eb',
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

export default FraudTrendChart;
