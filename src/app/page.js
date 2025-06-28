'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import TransactionFormAndList from '@/components/TransactionFormAndList';
import { FaCalendarAlt, FaListAlt } from 'react-icons/fa';
import CustomCalendar from '@/components/CustomCalendar'; // Import CustomCalendar
import MonthlyListView from '@/components/MonthlyListView';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTransactions();
    }
  }, [status]);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="flex flex-col flex-grow h-full w-full p-4">
      <div className="flex justify-between items-center mb-4 relative flex-shrink-0">
        <h1 className="text-4xl font-extrabold text-indigo-700 flex-grow text-center">Money Manager</h1>
        <button
          onClick={() => signOut()}
          className="py-2 right-0 absolute px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer bg-white"
        >
          Sign Out
        </button>
      </div>
      <div className="flex justify-end mb-8 flex-shrink-0">
        <button
          onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer bg-white flex items-center space-x-2"
        >
          {viewMode === 'calendar' ? (
            <>
              <FaListAlt size={20} />
              <span>Monthly Summary</span>
            </>
          ) : (
            <>
              <FaCalendarAlt size={20} />
              <span>Calendar</span>
            </>
          )}
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="flex justify-center flex-grow overflow-hidden">
          <CustomCalendar
            onDateClick={(selectedDate) => {
              setDate(selectedDate);
              setShowTransactionModal(true);
            }}
            value={date}
            transactions={transactions}
          />
        </div>
      ) : (
        <div className="flex justify-center flex-grow overflow-hidden">
          <MonthlyListView transactions={transactions} />
        </div>
      )}



      {showTransactionModal && (
        <Modal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} title="Manage Transactions">
          <TransactionFormAndList />
        </Modal>
      )}
    </div>
  );
}