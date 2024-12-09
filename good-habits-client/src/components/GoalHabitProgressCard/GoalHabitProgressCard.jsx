import React, { useEffect, useState } from "react";
import "./GoalHabitProgressCard.css";

function GoalHabitProgressCard({ title, completedDays, totalDays, frequency }) {
    const progressPercent = Math.min((completedDays / totalDays) * 100, 100);

    return (
        <div className="habit-card-container">
            <div className="habit-card-header">
                <h3 className="habit-card-title">{title}</h3>
                <div className="habit-card-menu">⋮</div>
            </div>
            <div className="habit-card-progress">
                <div className="habit-card-progress-bar">
                    <div
                        className="habit-card-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <div className="habit-card-progress-info">
                    {completedDays} from {totalDays} days target
                </div>
            </div>
            <div className="habit-card-frequency">{frequency}</div>
        </div>
    );
}

export default GoalHabitProgressCard;
