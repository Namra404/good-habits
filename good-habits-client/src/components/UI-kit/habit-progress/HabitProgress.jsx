import React from "react";
import "./HabitProgress.css";

function HabitProgress({ totalHabits, completedHabits, hideProgressText = false }) {
    // Проверяем, чтобы избежать деления на 0
    const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return (
        <div className="habit-progress-card">
            <div className="progress-circle">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle
                        className="circle-background"
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="10"
                    />
                    <circle
                        className="circle-progress"
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="10"
                        strokeDasharray="282"
                        strokeDashoffset={
                            totalHabits > 0 ? (1 - completedHabits / totalHabits) * 282 : 282
                        }
                    />
                </svg>
                <div className="percentage">{percentage}%</div>
            </div>
            {!hideProgressText && (
                <h2 className="progress-text">
                    {totalHabits > 0
                        ? `${completedHabits} из ${totalHabits} чек-инов сегодня!`
                        : "Сегодня нет чек-инов!"}
                </h2>
            )}
        </div>
    );
}

export default HabitProgress;
