import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { personalFinanceConfig, calculateMonthlyBalance, calculateRemainingLoanPayments } from '../lib/personalFinanceConfig';

interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  created_at: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'created_at'>>({
    amount: 0,
    category: '',
    description: '',
    type: 'expense'
  });

  const monthlyBalance = calculateMonthlyBalance();
  const { remainingPayments, remainingAmount } = calculateRemainingLoanPayments();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    });
    if (res.ok) {
      fetchTransactions();
      setNewTransaction({
        amount: 0,
        category: '',
        description: '',
        type: 'expense'
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Personal Finance Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">Financial Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-blue-200">Loan</h3>
                <p className="text-2xl font-bold">€{personalFinanceConfig.loan.amount}</p>
                <p className="text-sm text-gray-400">€{personalFinanceConfig.loan.monthlyPayment}/month</p>
                <p className="text-sm text-gray-400 mt-2">Remaining: €{remainingAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Payments left: {remainingPayments}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-blue-200">Monthly Salary</h3>
                <p className="text-2xl font-bold">€{personalFinanceConfig.income.monthlySalary}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-blue-200">Monthly Expenses</h3>
                <p className="text-2xl font-bold">€{personalFinanceConfig.expenses.rent + personalFinanceConfig.expenses.utilities}</p>
                <p className="text-sm text-gray-400">Rent: €{personalFinanceConfig.expenses.rent}</p>
                <p className="text-sm text-gray-400">Utilities: €{personalFinanceConfig.expenses.utilities}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-blue-200">Monthly Balance</h3>
                <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  €{monthlyBalance}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-blue-200">Additional Info</h3>
              <p>Credit Cards: {personalFinanceConfig.creditCards}</p>
              <p>Dependents: {personalFinanceConfig.dependents} (spouse)</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  required
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  placeholder="Category"
                  required
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
                <select
                  id="type"
                  name="type"
                  value={newTransaction.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Add Transaction
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Transaction History</h2>
          <div className="h-64 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="created_at" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}