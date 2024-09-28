import React, { useEffect, useState } from 'react';

const DateAndTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [remainingDays, setRemainingDays] = useState(0);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }; // Set hour12 to true for AM/PM format
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }; // Format date
            setCurrentDateTime(now.toLocaleTimeString([], timeOptions)); // Format time for digital clock
            setCurrentDate(now.toLocaleDateString([], dateOptions)); // Format date for display

            // Calculate remaining days in the current month
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const currentDay = now.getDate();
            const daysLeft = lastDayOfMonth - currentDay;

            setRemainingDays(daysLeft);
        };

        updateDateTime(); // Initial call
        const interval = setInterval(updateDateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className="lg:flex gap-5 text-xl font-semibold my-5">
            <div className='flex items-center gap-3'>
                <p>{currentDate}</p> {/* Display today's date */}
                <p>{currentDateTime}</p> {/* Display the current time */}
            </div>
            <div className='flex items-center gap-3 text-red-400'>
                <h2>Remaining Days This Month:</h2>
                <p>{remainingDays} days</p> {/* Display the remaining days in the month */}
            </div>
        </div>
    );
};

export default DateAndTime;
