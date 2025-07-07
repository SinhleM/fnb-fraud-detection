import React, { useEffect, useState } from "react";

export default function FraudTransactionList() {
  const [fraudTxns, setFraudTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/fraud-transactions")
      .then((res) => res.json())
      .then((data) => {
        setFraudTxns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading flagged transactions...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-red-200">
            <th className="py-2 px-4">Transaction ID</th>
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Timestamp</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Rules Applied</th>
          </tr>
        </thead>
        <tbody>
          {fraudTxns.map(({ transaction_id, user_id, timestamp, amount, rules_applied }) => (
            <tr key={transaction_id} className="border-b hover:bg-red-100">
              <td className="py-2 px-4">{transaction_id}</td>
              <td className="py-2 px-4">{user_id}</td>
              <td className="py-2 px-4">{timestamp}</td>
              <td className="py-2 px-4">R {amount.toFixed(2)}</td>
              <td className="py-2 px-4">{rules_applied}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
