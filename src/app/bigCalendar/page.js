'use client'

import { useEffect, useState } from "react"
import classNames from "classnames";
import Modal from "@/components/modal";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";

const MonthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
const WeekList = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
]

export default function BigCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [datesInMonth, setDatesInMonth] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (myDate) => {
    const year = myDate.getFullYear();
    const month = myDate.getMonth();

    // get first day of month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // get last date of month
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    // get last day of month
    const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
    // get last date of previous month
    const lastDateOfLastMonth = new Date(year, month, 0).getDate();

    const currentMonthDates = [];

    // capture previous month dates
    for (let index = firstDayOfMonth; index > 0; index--) {
      currentMonthDates.push({
        date: lastDateOfLastMonth - index + 1,
        month: MonthList[(month - 1 + 12) % 12],
        year: month === 0 ? year - 1 : year,
        classes: "text-gray-400"
      });
    }

    const dateToday = new Date();

    // capture current month dates
    for (let index = 1; index <= lastDateOfMonth; index++) {
      currentMonthDates.push({
        date: index,
        month: MonthList[month],
        year,
        classes: dateToday.getFullYear() === year && dateToday.getMonth() === month && dateToday.getDate() === index ? "!bg-blue-400 !text-white" : ""
      });
    }

    // capture next month dates
    for (let index = 1; currentMonthDates.length < 42; index++) {
      currentMonthDates.push({
        date: index,
        month: MonthList[(month + 1) % 12],
        year: month === 11 ? year + 1 : year,
        classes: "text-gray-400"
      });
    }

    setDatesInMonth(currentMonthDates);
  }

  const handleSetPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  const handleSetNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  const handleDateClick = () => {
    setModalOpen(true);
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-800">
        <div className="w-44 flex"></div>
        <div className="w-44 flex justify-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-50">{MonthList[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
        </div>
        <div className="w-44 flex justify-around mr-10">
          <button onClick={handleSetPrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300">
            <ChevronLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100" onClick={() => setCurrentDate(new Date())}>
            Today
          </button>
          <button onClick={handleSetNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300">
            <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <table className="h-full">
        <thead>
          <tr className="grid grid-cols-7 gap-1">
            {
              WeekList.map((weekname) =>
                <th key={weekname} className="text-sm border font-medium text-center text-gray-500 bg-white dark:bg-gray-950 dark:text-gray-400">
                  <div className="p-2 flex justify-center">
                    {weekname}
                  </div>
                </th>
              )
            }
          </tr>
        </thead>
        <tbody>
          <tr className="grid grid-cols-7 gap-1">
            {
              datesInMonth.map(({ date, month, year, classes }) => {
                return <td
                  key={date + month + year}
                  id={month}
                  className={classNames("cursor-pointer text-sm border font-medium text-center", classes)}
                  onClick={handleDateClick}
                >
                  <div className="flex flex-col p-2 h-28">
                    <div className="flex justify-center">
                      {date}
                    </div>
                  </div>
                </td>
              })
            }
          </tr>
        </tbody>
      </table>

      <Modal
        modalOpen={modalOpen}
        onModalClose={() => setModalOpen(false)}
      />
    </div>
  )
}