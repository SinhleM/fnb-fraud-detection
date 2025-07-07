import React from "react";

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">FNB Fraud Detection</h1>
        {/* You can add nav links here */}
      </div>
    </header>
  );
}
