'use client';

import React, { useState, useEffect, useRef } from 'react';
import CategoryModal from '@/components/CategoryModal';
import { FaEdit, FaPlus } from 'react-icons/fa';
import CustomCalendar from '@/components/CustomCalendar';

export default function TransactionFormAndList() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [date, setDate] = useState(new Date()); // Set default date to today
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [selectedType, setSelectedType] = useState('expense');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [repeatType, setRepeatType] = useState('None'); // New state for repeat type
  const [isRepeatDropdownOpen, setIsRepeatDropdownOpen] = useState(false); // New state for repeat dropdown

  const repeatOptions = [
    { label: 'None', value: 'None' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Annually', value: 'Annually' },
  ];

  useEffect(() => {
    fetchTransactions();

    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCategories(selectedType);
  }, [selectedType]);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
  };

  const fetchCategories = async (type) => {
    const res = await fetch(`/api/categories?type=${type}`);
    const data = await res.json();
    setCategories(data);
    if (data.length > 0) {
      setSelectedCategory({ value: data[0].name, label: data[0].name, icon: data[0].icon });
    } else {
      setSelectedCategory(null);
    }
  };

  const handleAddCategory = async ({ name, type }) => {
    if (!name) return;

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, type }),
    });

    if (res.ok) {
      setNewCategoryName('');
      fetchCategories(selectedType);
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchCategories(selectedType);
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (parseFloat(value) < 0) {
      setAmountError('Amount cannot be negative');
    } else {
      setAmountError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !selectedCategory || amountError) return; // Check amountError

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, amount: parseFloat(amount), type: selectedType, category: selectedCategory.value, date, repeatType }),
    });

    if (res.ok) {
      setDescription('');
      setAmount('');
      setDate(new Date()); // Reset date to today
      setRepeatType('None'); // Reset repeat type
      fetchTransactions();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded shadow-md w-full mx-auto"> 
        
        <div className="mb-6 flex rounded-lg shadow-md overflow-hidden"> {/* Increased spacing and added shadow */} 
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-lg font-semibold transition-all duration-300 ease-in-out cursor-pointer ${
              selectedType === 'expense' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedType('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-lg font-semibold transition-all duration-300 ease-in-out cursor-pointer ${
              selectedType === 'income' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedType('income')}
          >
            Income
          </button>
        </div>

        <div key={selectedType} className="transition-opacity duration-300 ease-in-out opacity-100">
          {/* Date field */} 
          <div className="mb-4 flex items-end space-x-2">
            <div className="flex-grow-[3]"> {/* Takes more than 80% width */} 
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <input
                  type="text"
                  id="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  value={date.toLocaleDateString()}
                  onFocus={() => setShowCalendar(true)}
                  readOnly
                />
                {showCalendar && (
                  <div className="absolute z-10 mt-1" ref={calendarRef}>
                    <CustomCalendar
                      onDateClick={(selectedDate) => {
                        setDate(selectedDate);
                        setShowCalendar(false);
                      }}
                      selectedDate={date}
                      variant="popover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow"> {/* Remaining width */} 
              <label htmlFor="repeatType" className="block text-sm font-medium text-gray-700">Repeat</label>
              <div className="relative">
                <button
                  type="button"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-left cursor-pointer"
                  onClick={() => setIsRepeatDropdownOpen(!isRepeatDropdownOpen)}
                >
                  {repeatType}
                </button>
                {isRepeatDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {repeatOptions.map((option) => (
                      <div
                        key={option.value}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRepeatType(option.value);
                          setIsRepeatDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              required
            />
            {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <div className="relative flex items-center space-x-2">
              <div className="flex-1">
                <button
                  type="button"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-left cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedCategory ? (
                    <div className="flex items-center space-x-2">
                      <span>{selectedCategory.label}</span>
                    </div>
                  ) : (
                    <span>Select a category</span>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {categories.map((cat) => {
                      return (
                        <div
                          key={cat._id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCategory({ value: cat.name, label: cat.name, icon: cat.icon });
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span>{cat.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="mt-1 p-2 h-10 w-10 flex items-center justify-center border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 cursor-pointer"
              >
                <FaEdit size={20} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 text-lg font-medium rounded-md shadow-lg transition-all duration-300 ease-in-out cursor-pointer text-white ${selectedType === 'expense' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center space-x-2`}
          >
            <FaPlus /> <span>{`Add ${selectedType === 'expense' ? 'Expense' : 'Income'}`}</span>
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((transaction) => {
              return (
                <li key={transaction._id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">Category: {transaction.category}</p>
                    </div>
                  </div>
                  <p className={`text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showCategoryModal && (
        <CategoryModal
          selectedType={selectedType}
          categories={categories}
          fetchCategories={fetchCategories}
          onClose={() => setShowCategoryModal(false)}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}