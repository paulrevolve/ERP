import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const CustomDatePicker = ({ selectedDate, onChange, onClose }) => {
  // Initialize state based on selectedDate or current date
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date(),
  );

  const calendarRef = useRef(null);

  // --- Leap Year & Days Logic ---
  // Setting day to 0 of the next month returns the last day of the current month
  // This automatically handles Feb 28 vs 29 based on the year.
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const months = [
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
    "December",
  ];

  // Generate year range (e.g., 10 years back and 20 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - 10 + i);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDateClick = (day) => {
    // Format as YYYY-MM-DD for your state/API
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
    onChange(dateStr); // This will trigger your handleFieldChange (isDirty: true)
    onClose();
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    onChange(today);
    onClose();
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const renderDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    // Empty slots for previous month's trailing days
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Actual day buttons
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDate === dateString;
      const isToday = new Date().toISOString().split("T")[0] === dateString;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-8 h-8 flex items-center justify-center text-[11px] cursor-pointer rounded transition-all
            ${isSelected ? "bg-[#17414d] text-white font-bold" : "hover:bg-blue-100 text-gray-700"}
            ${isToday && !isSelected ? "border border-[#17414d] text-[#17414d]" : ""}
          `}
        >
          {day}
        </div>,
      );
    }
    return days;
  };

  return (
    <div
      ref={calendarRef}
      className="absolute z-[999] mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-2xl w-64 animate-in fade-in zoom-in duration-150"
    >
      {/* Header: Month & Year Selectors */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded text-gray-500"
          >
            <ChevronLeft size={16} />
          </button>

          <select
            value={currentDate.getMonth()}
            onChange={(e) =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), parseInt(e.target.value)),
              )
            }
            className="text-[11px] font-semibold border border-gray-200 rounded px-1 py-0.5 outline-none bg-white"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={currentDate.getFullYear()}
            onChange={(e) =>
              setCurrentDate(
                new Date(parseInt(e.target.value), currentDate.getMonth()),
              )
            }
            className="text-[11px] font-semibold border border-gray-200 rounded px-1 py-0.5 outline-none bg-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded text-gray-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-rose-500">
          <X size={16} />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 mb-1 border-b border-gray-100 pb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-bold text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-0.5">{renderDays()}</div>

      {/* Footer: Today Button */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleToday}
          className="px-4 py-1 border border-gray-800 rounded text-[11px] font-bold hover:bg-gray-50 active:scale-95 transition-all"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
