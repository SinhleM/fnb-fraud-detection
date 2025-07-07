import React, { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">User ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Account Type</th>
            <th className="py-2 px-4">Province</th>
            <th className="py-2 px-4">Signup Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ user_id, name, email, account_type, province, signup_date }) => (
            <tr key={user_id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{user_id}</td>
              <td className="py-2 px-4">{name}</td>
              <td className="py-2 px-4">{email}</td>
              <td className="py-2 px-4">{account_type}</td>
              <td className="py-2 px-4">{province}</td>
              <td className="py-2 px-4">{signup_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
