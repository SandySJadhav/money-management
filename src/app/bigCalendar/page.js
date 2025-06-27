'use client'

import { useEffect, useState } from "react"
import classNames from "classnames";
import Modal from "@/components/modal";
import { MONTH_LIST, WEEK_LIST } from "@/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "@contentful/f36-icons";
import { Button, IconButton, Tabs } from "@contentful/f36-components";

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
    // get last date of previous month
    const lastDateOfLastMonth = new Date(year, month, 0).getDate();
    const currentMonthDates = [];
    // capture previous month dates
    for (let index = firstDayOfMonth; index > 0; index--) {
      currentMonthDates.push({
        date: lastDateOfLastMonth - index + 1,
        month: MONTH_LIST[(month - 1 + 12) % 12],
        year: month === 0 ? year - 1 : year,
        classes: "text-gray-400"
      });
    }
    const dateToday = new Date();
    // capture current month dates
    for (let index = 1; index <= lastDateOfMonth; index++) {
      currentMonthDates.push({
        date: index,
        month: MONTH_LIST[month],
        year,
        classes: dateToday.getFullYear() === year && dateToday.getMonth() === month && dateToday.getDate() === index ? "!bg-blue-400 !text-white" : ""
      });
    }
    // capture next month dates
    for (let index = 1; currentMonthDates.length < 42; index++) {
      currentMonthDates.push({
        date: index,
        month: MONTH_LIST[(month + 1) % 12],
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
          <div className="text-lg font-medium text-gray-900 dark:text-gray-50">{MONTH_LIST[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
        </div>
        <div className="w-44 flex justify-around mr-10">
          <IconButton
            type="button"
            icon={<ChevronLeftIcon className="w-5 h-5" variant="muted" />}
            onClick={handleSetPrevMonth}
          />
          <Button
            variant="transparent"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <IconButton
            type="button"
            icon={<ChevronRightIcon className="w-5 h-5" variant="muted" />}
            onClick={handleSetNextMonth}
          />
        </div>
      </div>
      <table className="h-full">
        <thead>
          <tr className="grid grid-cols-7 gap-1">
            {
              WEEK_LIST.map((weekname) =>
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
      >
        <Tabs>
          <Tabs.List>
            <Tabs.Tab panelId="income">Income</Tabs.Tab>
            <Tabs.Tab panelId="expense">Expense</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="income">
            <div className="px-2 py-3">
              This is contents

            </div>
          </Tabs.Panel>
          <Tabs.Panel id="expense"><div className="px-2 py-3">This is second content</div></Tabs.Panel>
        </Tabs>
      </Modal>
    </div>
  )
}