import React from "react";
import "./GoalHabitsList.css";
import GoalHabitProgressCard from "@/components/GoalHabitProgressCard/GoalHabitProgressCard.jsx";
import {useNavigate} from "react-router-dom";

const GoalHabitsList = ({ habitsData }) => {
    const navigate = useNavigate(); // Хук для навигации

    if (!habitsData || habitsData.length === 0) {
        return <div>No goals to display.</div>;
    }

    return (
        <div className="habit-list-container">
            <div className="habit-list-header">
                <h2 className="habit-list-title">Ваши цели</h2>
                <button className="habit-list-see-all" onClick={() => navigate("/progress")}>
                    См. все
                </button>
            </div>
            <div className="habit-list-cards">
                {habitsData.map(({ habit, progress }) => (
                    <GoalHabitProgressCard
                        key={habit.id}
                        title={habit.title}
                        description={habit.description}
                        completedDays={progress?.completed_days || 0}
                        totalDays={habit.duration_days}
                        frequency="Каждый день"
                    />
                ))}
            </div>
        </div>
    );
};

export default GoalHabitsList;