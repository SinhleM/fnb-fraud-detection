import React from "react";
import Header from "../components/Header";
import UserList from "../components/UserList";
import TransactionList from "../components/TransactionList";
import FraudTransactionList from "../components/FraudTransactionList";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">FNB Fraud Detection Dashboard</h1>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Users</h2>
          <UserList />
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Transactions</h2>
          <TransactionList />
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Flagged Fraudulent Transactions</h2>
          <FraudTransactionList />
        </section>
      </main>

      <Footer />
    </div>
  );
}
