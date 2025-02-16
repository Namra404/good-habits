import React from "react";
import "./GoalHabitsList.css";
import GoalHabitProgressCard from "@/components/GoalHabitProgressCard/GoalHabitProgressCard.jsx";

const GoalHabitsList = ({ habitsData }) => {
    if (!habitsData || habitsData.length === 0) {
        return <div>No goals to display.</div>;
    }

    return (
        <div className="habit-list-container">
            <div className="habit-list-header">
                <h2 className="habit-list-title">Your Goals</h2>
                <button className="habit-list-see-all">See all</button>
            </div>
            <div className="habit-list-cards">
                {habitsData.map(({ habit, progress }) => (
                    <GoalHabitProgressCard
                        key={habit.id}
                        title={habit.title}
                        description={habit.description}
                        completedDays={progress?.completed_days || 0}
                        totalDays={habit.duration_days}
                        frequency="Everyday" // Заглушка для частоты
                    />
                ))}
            </div>
        </div>
    );
};

export default GoalHabitsList;