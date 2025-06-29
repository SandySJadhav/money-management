'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays, setMonth, setYear, getYear, getMonth, addYears, subYears, isBefore, isAfter } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CustomCalendar({ onDateClick, selectedDate, variant = 'default', transactions = [], onDailyTransactionsClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateState, setSelectedDateState] = useState(selectedDate || new Date());
  const [showMonthPopup, setShowMonthPopup] = useState(false);
  const [showYearPopup, setShowYearPopup] = useState(false);
  const [yearPopupStartYear, setYearPopupStartYear] = useState(new Date().getFullYear() - 5);

  const monthButtonRef = useRef(null);
  const yearButtonRef = useRef(null);
  const monthPopupRef = useRef(null);
  const yearPopupRef = useRef(null);

  const maxDate = endOfMonth(addYears(new Date(), 6));
  const minDate = startOfMonth(subYears(new Date(), 5));

  useEffect(() => {
    setSelectedDateState(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (monthPopupRef.current && !monthPopupRef.current.contains(event.target) && !monthButtonRef.current.contains(event.target)) {
        setShowMonthPopup(false);
      }
      if (yearPopupRef.current && !yearPopupRef.current.contains(event.target) && !yearButtonRef.current.contains(event.target)) {
        setShowYearPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    if (isBefore(endOfMonth(nextMonth), maxDate) || isSameMonth(endOfMonth(nextMonth), maxDate)) {
      setCurrentMonth(nextMonth);
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (isAfter(startOfMonth(prevMonth), minDate) || isSameMonth(startOfMonth(prevMonth), minDate)) {
      setCurrentMonth(prevMonth);
    }
  };

  const header = () => {
    const showPrevButton = isAfter(currentMonth, minDate);
    const showNextButton = isBefore(currentMonth, maxDate);

    return (
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
        {showPrevButton ? (
          <button onClick={handlePrevMonth} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
            <FaChevronLeft className="text-gray-500" />
          </button>
        ) : (
          <button disabled className="px-3 py-2 rounded-md bg-gray-200 opacity-50 cursor-not-allowed">
            <FaChevronLeft className="text-gray-500" />
          </button>
        )}
        <div className="flex items-center">
          <div className="relative">
            <h2 ref={monthButtonRef} className="text-xl font-semibold cursor-pointer" onClick={() => setShowMonthPopup(!showMonthPopup)}>
              {format(currentMonth, 'MMMM')}
            </h2>
            {showMonthPopup && renderMonthPopup()}
          </div>
          <div className="relative ml-2">
            <h2 ref={yearButtonRef} className="text-xl font-semibold cursor-pointer" onClick={() => setShowYearPopup(!showYearPopup)}>
              {format(currentMonth, 'yyyy')}
            </h2>
            {showYearPopup && renderYearPopup()}
          </div>
        </div>
        {showNextButton ? (
          <button onClick={handleNextMonth} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
            <FaChevronRight className="text-gray-500" />
          </button>
        ) : (
          <button disabled className="px-3 py-2 rounded-md bg-gray-200 opacity-50 cursor-not-allowed">
            <FaChevronRight className="text-gray-500" />
          </button>
        )}
      </div>
    );
  };

  const renderMonthPopup = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const validMonths = months.filter(month => {
      const monthDate = setMonth(currentMonth, month);
      return !isAfter(monthDate, maxDate) && !isBefore(monthDate, minDate);
    });

    return (
      <div ref={monthPopupRef} className="absolute z-20 bg-white p-4 rounded-lg shadow-md grid grid-cols-3 gap-2 left-1/2 -translate-x-1/2 mt-2 w-80">
        <h3 className="text-lg font-semibold col-span-3 text-center mb-2 border-b border-gray-200 pb-2">Select Month</h3>
        {validMonths.length > 0 ? (
          validMonths.map(month => (
            <div
              key={month}
              className="p-2 text-left rounded-md cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setCurrentMonth(setMonth(currentMonth, month));
                setShowMonthPopup(false);
              }}
            >
              {format(new Date(0, month), 'MMMM')}
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">No available months</div>
        )}
      </div>
    );
  };

  const renderYearPopup = () => {
    const years = Array.from({ length: 12 }, (_, i) => yearPopupStartYear + i);
    const validYears = years.filter(year => year <= getYear(maxDate) && year >= getYear(minDate));

    return (
      <div ref={yearPopupRef} className="absolute z-20 bg-white p-4 rounded-lg shadow-md left-1/2 -translate-x-1/2 mt-2 w-80">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setYearPopupStartYear(yearPopupStartYear - 12)} className={`px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 ${yearPopupStartYear <= getYear(minDate) ? 'invisible' : ''}`}>
            &lt;
          </button>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Select Year</h3>
          <button onClick={() => setYearPopupStartYear(yearPopupStartYear + 12)} className={`px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 ${yearPopupStartYear + 11 >= getYear(maxDate) ? 'invisible' : ''}`}>
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {validYears.length > 0 ? (
            validYears.map(year => (
              <div
                key={year}
                className="p-2 text-center rounded-md cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setCurrentMonth(setYear(currentMonth, year));
                  setShowYearPopup(false);
                }}
              >
                {year}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">No available years</div>
          )}
        </div>
      </div>
    );
  };

  const daysOfWeek = () => {
    const days = [];
    const dateFormat = 'EEE';
    let startDay = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-right font-medium text-gray-600">
          {format(startDay, dateFormat)}
        </div>
      );
      startDay = new Date(startDay.setDate(startDay.getDate() + 1));
    }
    return <div className="grid grid-cols-7 gap-2 mb-4">{days}</div>;
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = new Date();

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    let hasValidDays = false;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        if (isAfter(cloneDay, maxDate) || isBefore(cloneDay, minDate)) {
          days.push(<div key={cloneDay} className="p-2 text-center rounded-md"></div>);
        } else {
          hasValidDays = true;
          const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), cloneDay));
          const dailyIncome = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          const dailyExpense = transactions
            .filter(t => isSameDay(new Date(t.date), cloneDay) && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          const incomeRibbon = dailyIncome > 0 ? (
            <div className="flex items-center text-xs mt-1 px-1 rounded-md bg-green-200 text-green-800">
              <span className="mr-1">Income:</span>
              <span>+{dailyIncome.toFixed(2)}</span>
            </div>
          ) : null;

          const expenseRibbon = dailyExpense > 0 ? (
            <div className="flex items-center text-xs mt-1 px-1 rounded-md bg-red-200 text-red-800">
              <span className="mr-1">Expense:</span>
              <span>-{dailyExpense.toFixed(2)}</span>
            </div>
          ) : null;

          const netRibbon = (dailyIncome > 0 && dailyExpense > 0) ? (
            <div className="flex items-center text-xs px-1 py-0.5 rounded-md bg-gray-200 text-gray-800 w-full text-left">
              <span className="mr-1">Net:</span>
              <span>{(dailyIncome - dailyExpense).toFixed(2)}</span>
            </div>
          ) : null;

          days.push(
            <div
              key={cloneDay}
              className={`p-2 rounded-md cursor-pointer flex-grow flex flex-col items-start justify-start relative overflow-hidden ${
                isSameDay(cloneDay, today)
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-200'
              }`}
              onClick={() => {
                setSelectedDateState(cloneDay);
                if (dailyIncome > 0 || dailyExpense > 0) {
                  onDailyTransactionsClick(cloneDay, dayTransactions);
                } else {
                  onDateClick(cloneDay); // Call original onDateClick if no ribbons
                }
              }}
            >
              <span className={`absolute top-1 right-1 ${!isSameMonth(cloneDay, currentMonth) ? 'text-base text-gray-400' : 'text-lg'}`}>{formattedDate}</span>
              <div className="flex flex-col w-full mt-6 space-y-0.5">
                {incomeRibbon}
                {expenseRibbon}
                {netRibbon}
              </div>
            </div>
          );
        }
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2 flex-grow" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    if (!hasValidDays) {
      return <div className="text-center text-gray-500">No available dates in this month</div>;
    }

    return <div className="flex flex-col flex-grow">{rows}</div>;
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md relative flex flex-col ${variant === 'popover' ? 'absolute z-10 mt-1 w-80' : 'w-full mx-auto h-[700px]'}`}>
      {header()}
      {daysOfWeek()}
      {cells()}
    </div>
  );
}
