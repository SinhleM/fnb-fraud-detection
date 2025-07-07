import React, { useEffect, useState } from "react";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Transaction ID</th>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Timestamp</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Channel</th>
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">Merchant</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(
            ({
              transaction_id,
              user_id,
              timestamp,
              amount,
              type,
              channel,
              location,
              merchant,
            }) => (
              <tr key={transaction_id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{transaction_id}</td>
                <td className="py-2 px-4">{user_id}</td>
                <td className="py-2 px-4">{timestamp}</td>
                <td className="py-2 px-4">R {amount.toFixed(2)}</td>
                <td className="py-2 px-4">{type}</td>
                <td className="py-2 px-4">{channel}</td>
                <td className="py-2 px-4">{location}</td>
                <td className="py-2 px-4">{merchant}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
