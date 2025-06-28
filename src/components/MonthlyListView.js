import React from 'react';
import { format, getMonth, getYear } from 'date-fns';

export default function MonthlyListView({ transactions }) {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = format(date, 'yyyy-MM'); // Group by year and month

    if (!acc[monthYear]) {
      acc[monthYear] = {
        income: 0,
        expense: 0,
        month: getMonth(date),
        year: getYear(date),
      };
    }

    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expense += transaction.amount;
    }

    return acc;
  }, {});

  // Sort months from newest to oldest
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => b.localeCompare(a));

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Monthly Summary</h2>
      {sortedMonths.length === 0 ? (
        <p>No transactions for monthly summary.</p>
      ) : (
        <ul className="space-y-4">
          {sortedMonths.map((monthYear) => {
            const data = monthlyData[monthYear];
            const monthName = format(new Date(data.year, data.month), 'MMMM yyyy');
            const netTotal = data.income - data.expense;
            const netColorClass = netTotal >= 0 ? 'text-green-600' : 'text-red-600';

            return (
              <li key={monthYear} className="p-4 border rounded-md shadow-sm bg-white">
                <h3 className="text-lg font-medium mb-2">{monthName}</h3>
                {data.income > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">Income:</p>
                    <p className="text-green-600">+{data.income.toFixed(2)}</p>
                  </div>
                )}
                {data.expense > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">Expense:</p>
                    <p className="text-red-600">-{data.expense.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <p className="font-semibold">Net Total:</p>
                  <p className={`font-semibold ${netColorClass}`}>{netTotal.toFixed(2)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
