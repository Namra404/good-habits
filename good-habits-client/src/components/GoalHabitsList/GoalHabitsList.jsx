import React, {useEffect, useState} from "react";

import "./GoalHabitsList.css";
import GoalHabitProgressCard from "@/components/GoalHabitProgressCard/GoalHabitProgressCard.jsx";
import axios from "axios";

const GoalHabitsList = ({ habits, progress }) => {
    const mergedData = habits.map((habit) => {
        const habitProgress = progress.find((prog) => prog.habit_id === habit.id);

        return {
            id: habit.id,
            title: habit.title,
            description: habit.description,
            durationDays: habit.duration_days,
            completedDays: habitProgress ? habitProgress.completed_days : 0,
            frequency: "Everyday", // Заглушка для частоты
        };
    });

    return (
        <div className="habit-list-container">
            <div className="habit-list-header">
                <h2 className="habit-list-title">Your Goals</h2>
                <button className="habit-list-see-all">See all</button>
            </div>
            <div className="habit-list-cards">
                {mergedData.map((habit) => (
                    <GoalHabitProgressCard
                        key={habit.id}
                        title={habit.title}
                        completedDays={habit.completedDays}
                        totalDays={habit.durationDays}
                        frequency={habit.frequency}
                    />
                ))}
            </div>
        </div>
    );
};
export default GoalHabitsList;
