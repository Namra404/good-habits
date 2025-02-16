import React, { useState, useEffect } from "react";
import "./DateSelector.css";
import {useNavigate} from "react-router-dom";

const DateSelector = ({ onDateChange }) => {
    const navigate = useNavigate();
    // Генерация дней текущей недели
    const getWeekDates = () => {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + i);
            return {
                day: date.getDate(),
                month: date.toLocaleString("en-US", { month: "short" }),
                value: date.toISOString().split("T")[0],
            };
        });
    };

    // Убедимся, что dates всегда определен
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const weekDates = getWeekDates();
        setDates(weekDates); // Инициализация дат
        setSelectedDate(weekDates[0]?.value || ""); // Установим первую дату недели
    }, []);

    useEffect(() => {
        if (selectedDate) {
            onDateChange(selectedDate);
        }
    }, [selectedDate, onDateChange]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="date-selector">
            <button className="back-button" onClick={() => navigate('/')}>←</button>
            <h2>Your Habit</h2>
            {/* Прокручиваемый блок */}
            <div className="date-list-scroll">
                <div className="date-list">
                    {dates.map((date, index) => (
                        <div
                            key={index}
                            className={`date-item ${selectedDate === date.value ? "active" : ""}`}
                            onClick={() => handleDateClick(date.value)}
                        >
                            <span className="day">{date.day}</span>
                            <span className="month">{date.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DateSelector;
