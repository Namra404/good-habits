import React from "react";
import "./HabitProgress.css";

function HabitProgress({ totalHabits, completedHabits }) {
    const percentage = Math.round((completedHabits / totalHabits) * 100);

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
                        strokeDashoffset={(1 - completedHabits / totalHabits) * 282}
                    />
                </svg>
                <div className="percentage">{percentage}%</div>
            </div>
            <h2 className="progress-text">{`${completedHabits} из ${totalHabits} чек-инов сегодня!`}</h2>

        </div>
    );
}

export default HabitProgress;
