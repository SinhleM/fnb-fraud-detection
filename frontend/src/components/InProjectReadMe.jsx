// src/components/InProjectReadme.jsx
import React from 'react';

const InProjectReadme = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Data Engineering Project: Fraud Detection Dashboard</h2> {/* Smaller heading */}
            <div className="prose prose-xs max-w-none text-gray-700">
                <p className="mb-4 text-xs"> {/* Applied text-xs */}
                    This project demonstrates a robust data engineering pipeline and an interactive dashboard
                    for real-time fraud detection and monitoring. It highlights capabilities in data ingestion,
                    transformation, analysis, and visualization.
                </p>

                <h3 className="text-base font-semibold mt-6 mb-2">Key Data Engineering Contributions:</h3> {/* Smaller subheading */}
                <ul className="list-disc list-inside space-y-1">
                    <li className="text-xs"> {/* Applied text-xs */}
                        <span className="font-bold">Data Generation & Ingestion:</span> Developed scripts for synthetic user and transaction data generation.
                        Implemented an ETL pipeline to continuously load this data into a PostgreSQL database.
                    </li>
                    <li className="text-xs"> {/* Applied text-xs */}
                        <span className="font-bold">Fraud Detection & Transformation:</span> Engineered a Python-based fraud detection module (`detect_fraud.py`)
                        that processes raw transactions, identifies suspicious patterns, and flags fraudulent activities.
                        This includes calculating dynamic risk scores based on transaction history, fraud ratios, and volume spikes.
                    </li>
                    <li className="text-xs"> {/* Applied text-xs */}
                        <span className="font-bold">API Development:</span> Built a Python Flask API to serve processed user and transaction data,
                        enabling efficient consumption by the frontend dashboard.
                    </li>
                    <li className="text-xs"> {/* Applied text-xs */}
                        <span className="font-bold">Real-time Capabilities:</span> Configured the frontend to fetch and refresh data every 60 seconds,
                        simulating real-time anomaly detection and operational monitoring.
                    </li>
                </ul>

                <h3 className="text-base font-semibold mt-6 mb-2">Technology Stack:</h3> {/* Smaller subheading */}
                <ul className="list-disc list-inside space-y-1">
                    <li className="text-xs"><span className="font-bold">Backend & Data Processing:</span> Python, Flask, PostgreSQL.</li> {/* Applied text-xs */}
                    <li className="text-xs"><span className="font-bold">Frontend:</span> React.js, Tailwind CSS.</li> {/* Applied text-xs */}
                    <li className="text-xs"><span className="font-bold">Data Storage:</span> PostgreSQL (via `load_to_postgres.py`).</li> {/* Applied text-xs */}
                </ul>
                <p className="mt-6 text-xs text-gray-600"> {/* Applied text-xs */}
                    This project showcases end-to-end data flow management, from raw data to actionable insights,
                    with a focus on scalable and maintainable data solutions.
                </p>
            </div>
        </div>
    );
};

export default InProjectReadme;