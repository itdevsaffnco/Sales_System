import React, { useState } from 'react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    isSameMonth, 
    isSameDay, 
    isWithinInterval,
    startOfDay,
    endOfDay,
    subDays
} from 'date-fns';

export default function DateRangePicker({ onClose, onApply, align = 'right' }) {
    // Default to showing Jan 2026 and Feb 2026 as per screenshot, 
    // but better to use current date logic or props.
    // For this implementation, I'll use state to track the "current" month view.
    // The view will show `viewDate` and `viewDate + 1 month`.
    
    // Initial state: Jan 1 2026 - Jan 30 2026 (matching screenshot)
    // Or just default to today. Let's stick to a realistic default.
    const [startDate, setStartDate] = useState(new Date(2026, 0, 1)); // Jan 1 2026
    const [endDate, setEndDate] = useState(new Date(2026, 0, 30));   // Jan 30 2026
    const [viewDate, setViewDate] = useState(new Date(2026, 0, 1));  // View starts at Jan 2026

    const [activeRange, setActiveRange] = useState('Custom'); // 'Custom', 'Yesterday', 'Last 7 Days', etc.

    const handleDayClick = (day) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
            setActiveRange('Custom');
        } else if (startDate && !endDate) {
            if (day < startDate) {
                setStartDate(day);
                setEndDate(startDate);
            } else {
                setEndDate(day);
            }
        }
    };

    const handlePresetClick = (preset) => {
        const today = new Date(2026, 0, 30); // Mocking "Today" as Jan 30 2026 based on screenshot context if needed, or real today
        // Let's use real today for logic, but for the screenshot match I'll just set specific dates if requested.
        // For now, standard logic:
        const realToday = new Date();
        
        let newStart, newEnd;
        
        switch (preset) {
            case 'Yesterday':
                newStart = subDays(realToday, 1);
                newEnd = subDays(realToday, 1);
                break;
            case 'Last 7 Days':
                newEnd = realToday;
                newStart = subDays(realToday, 6);
                break;
            case 'Last 30 Days':
                newEnd = realToday;
                newStart = subDays(realToday, 29);
                break;
            default:
                break;
        }
        
        if (newStart && newEnd) {
            setStartDate(newStart);
            setEndDate(newEnd);
            setActiveRange(preset);
            setViewDate(startOfMonth(newEnd)); // Move view to the end date
        }
    };

    const daysSelected = startDate && endDate 
        ? Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 
        : 0;

    const renderCalendar = (monthDate) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const startDateCalendar = startOfDay(monthStart);
        const endDateCalendar = endOfDay(monthEnd);
        
        // Grid needs to start from the correct day of week
        // 0 = Sunday, 1 = Monday, ...
        // Screenshot shows Monday as first column (Mo Tu We ...)
        const startDay = startDateCalendar.getDay(); 
        // We need to adjust for Monday start: Sunday(0) becomes 6, Monday(1) becomes 0
        const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
        
        // Generate days padding for the beginning
        const paddingDays = Array.from({ length: adjustedStartDay }).map((_, i) => {
             const day = subDays(startDateCalendar, adjustedStartDay - i);
             return { date: day, isCurrentMonth: false };
        });

        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(day => ({
            date: day,
            isCurrentMonth: true
        }));

        // Total slots should be multiple of 7 usually 35 or 42
        const totalDays = [...paddingDays, ...daysInMonth];
        const remainingSlots = 42 - totalDays.length;
        const trailingDays = Array.from({ length: remainingSlots }).map((_, i) => {
             // Just add days after month end
             const day = new Date(monthEnd);
             day.setDate(day.getDate() + i + 1);
             return { date: day, isCurrentMonth: false };
        });

        const allDays = [...totalDays, ...trailingDays];

        return (
            <div className="w-64">
                <div className="flex justify-between items-center mb-4">
                    {/* Navigation Arrows only on edges of the double view? 
                        Screenshot shows left arrow on left calendar, right arrow on right calendar? 
                        Actually screenshot shows:
                        Left Cal: < Month Year
                        Right Cal: Month Year >
                    */}
                    {isSameMonth(monthDate, viewDate) && (
                         <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 rounded-full">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}
                    {!isSameMonth(monthDate, viewDate) && <div className="w-7"></div>} {/* Spacer */}

                    <h3 className="text-sm font-semibold text-gray-900">
                        {format(monthDate, 'MMMM yyyy')}
                    </h3>

                    {!isSameMonth(monthDate, viewDate) && (
                         <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 rounded-full">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}
                    {isSameMonth(monthDate, viewDate) && <div className="w-7"></div>}
                </div>

                <div className="grid grid-cols-7 mb-2">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1">
                    {allDays.map((dayObj, idx) => {
                        const date = dayObj.date;
                        const isSelectedStart = startDate && isSameDay(date, startDate);
                        const isSelectedEnd = endDate && isSameDay(date, endDate);
                        const isInRange = startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate });
                        
                        let bgClass = '';
                        let textClass = 'text-gray-700';
                        
                        if (!dayObj.isCurrentMonth) {
                            textClass = 'text-gray-300';
                        }

                        if (isSelectedStart || isSelectedEnd) {
                            bgClass = 'bg-gray-900 text-white rounded-full'; // Using gray-900 (blackish) as per screenshot "1" and "30" are dark
                            textClass = 'text-white';
                        } else if (isInRange) {
                            bgClass = 'bg-gray-100'; // Light gray background for range
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleDayClick(date)}
                                className={`
                                    h-8 w-8 text-sm flex items-center justify-center relative
                                    ${!isSelectedStart && !isSelectedEnd && isInRange ? 'bg-gray-100 w-full' : 'mx-auto'}
                                    ${dayObj.isCurrentMonth ? 'hover:bg-gray-200' : ''}
                                    ${!dayObj.isCurrentMonth && !isInRange ? 'invisible' : ''} 
                                `}
                                // Note: Screenshot shows non-current month days as visible but grayed out (e.g. 29, 30, 31 Dec in Jan view)
                                // I'll remove 'invisible' and use text color.
                            >
                                <div className={`h-8 w-8 flex items-center justify-center absolute z-10 ${bgClass} ${isSelectedStart || isSelectedEnd ? 'rounded-md' : ''}`}>
                                    {date.getDate()}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`absolute top-12 ${align === 'left' ? 'left-0' : 'right-0'} bg-white rounded-xl shadow-2xl border border-gray-200 flex z-50 font-sans min-w-max`}>
            {/* Sidebar */}
            <div className="w-40 border-r border-gray-200 p-2 bg-white flex-shrink-0">
                <div className="space-y-1 mb-4">
                    {['Yesterday', 'Last 7 Days', 'Last 30 Days'].map(preset => (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                activeRange === preset ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {preset}
                        </button>
                    ))}
                </div>
                
                <div className="border-t border-gray-100 my-2"></div>

                <div className="space-y-1">
                    {['Day', 'Week', 'Month'].map(item => (
                        <div key={item} className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                            <span>{item}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    ))}
                    
                    <div 
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer ${
                            activeRange === 'Custom' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveRange('Custom')}
                    >
                        <span>Custom</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Calendars */}
            <div className="p-6 flex-shrink-0">
                <div className="flex space-x-8">
                    {renderCalendar(viewDate)}
                    {renderCalendar(addMonths(viewDate, 1))}
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center mt-6 space-x-3 pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => { setStartDate(null); setEndDate(null); }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                    >
                        Clear &times;
                    </button>
                    <button 
                        onClick={() => onApply && onApply(startDate, endDate)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg shadow-sm"
                    >
                        {daysSelected} days selected
                    </button>
                </div>
            </div>
        </div>
    );
}