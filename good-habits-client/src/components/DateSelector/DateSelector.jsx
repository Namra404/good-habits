import React, { useState } from "react";
import "./DateSelector.css";

const DateSelector = ({ onDateChange }) => {
    const dates = [
        { day: 27, month: "Feb", value: "2024-02-27" },
        { day: 28, month: "Feb", value: "2024-02-28" },
        { day: 1, month: "March", value: "2024-03-01" },
    ];

    const [selectedDate, setSelectedDate] = useState(dates[0].value);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    return (
        <div className="date-selector">
            <button className="back-button">←</button>
            <h2>Your Habit</h2>
            <div className="date-list">
                {dates.map((date, index) => (
                    <div
                        key={index}
                        className={`date-item ${
                            selectedDate === date.value ? "active" : ""
                        }`}
                        onClick={() => handleDateClick(date.value)}
                    >
                        <span className="day">{date.day}</span>
                        <span className="month">{date.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DateSelector;