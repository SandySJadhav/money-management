import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaEdit, FaTrashAlt, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

export default function DailyTransactionsList({ transactions, date, onTransactionUpdated, onAddTransactionClick }) {
  const [editingId, setEditingId] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setNewAmount(transaction.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewAmount('');
  };

  const handleUpdateAmount = async (transactionId) => {
    if (parseFloat(newAmount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    const res = await fetch(`/api/transactions/${transactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: parseFloat(newAmount) }),
    });

    if (res.ok) {
      setEditingId(null);
      setNewAmount('');
      onTransactionUpdated(); // Notify parent to re-fetch transactions
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    const res = await fetch(`/api/transactions/${transactionId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      onTransactionUpdated(); // Notify parent to re-fetch transactions
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={onAddTransactionClick}
          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus size={24} />
        </button>
      </div>
      {transactions.length === 0 ? (
        <p>No transactions for this date.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="p-3 border rounded shadow-sm flex justify-between items-center">
              <div className="flex-grow">
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">Category: {transaction.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                {editingId === transaction._id ? (
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-24 p-1 border rounded-md text-right"
                    min="0.01"
                    step="0.01"
                  />
                ) : (
                  <p className={`text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                )}
                {editingId === transaction._id ? (
                  <>
                    <button onClick={() => handleUpdateAmount(transaction._id)} className="text-green-500 hover:text-green-700">
                      <FaCheck />
                    </button>
                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-700">
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(transaction)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteTransaction(transaction._id)} className="text-red-500 hover:text-red-700">
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
