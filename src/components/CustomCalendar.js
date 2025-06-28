'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays } from 'date-fns';

export default function CustomCalendar({ onDateClick, selectedDate, variant = 'default' }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateState, setSelectedDateState] = useState(selectedDate || new Date());

  useEffect(() => {
    setSelectedDateState(selectedDate);
  }, [selectedDate]);

  const header = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
          &lt;
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
          &gt;
        </button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const days = [];
    const dateFormat = 'EEE';
    let startDay = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-600">
          {format(startDay, dateFormat)}
        </div>
      );
      startDay = new Date(startDay.setDate(startDay.getDate() + 1));
    }
    return <div className="grid grid-cols-7 gap-2 mb-2">{days}</div>;
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        days.push(
          <div
            key={cloneDay}
            className={`p-2 text-center rounded-md cursor-pointer ${
              !isSameMonth(cloneDay, currentMonth)
                ? 'text-gray-400'
                : isSameDay(cloneDay, selectedDateState)
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedDateState(cloneDay);
              onDateClick(cloneDay);
            }}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${variant === 'popover' ? 'absolute z-10 mt-1 w-64' : 'w-11/12 h-full mx-auto my-auto max-w-screen-lg'}`}>
      {header()}
      {daysOfWeek()}
      {cells()}
    </div>
  );
}
