'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import TransactionFormAndList from '@/components/TransactionFormAndList';
import CustomCalendar from '@/components/CustomCalendar'; // Import CustomCalendar

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 flex-grow text-center">Money Manager</h1>
        <button
          onClick={() => signOut()}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer bg-white"
        >
          Sign Out
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <CustomCalendar
          onDateClick={setDate}
          value={date}
        />
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowTransactionModal(true)}
          className="py-3 px-6 text-lg font-medium rounded-md shadow-lg transition-all duration-300 ease-in-out cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center space-x-2 mx-auto"
        >
          Add New Transaction
        </button>
      </div>

      {showTransactionModal && (
        <Modal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} title="Manage Transactions">
          <TransactionFormAndList />
        </Modal>
      )}
    </div>
  );
}