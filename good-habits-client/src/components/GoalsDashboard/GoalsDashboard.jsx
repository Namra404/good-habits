import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HabitGoalProgress from '@/components/HabitProgress/HabitGoalProgress.jsx';
import './GoalsDashboard.css';
import UserHabitService from "@/services/UserHabit.jsx";
import {useUser} from "@/store/user-provider.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";

const GoalsDashboard = () => {
    const {user} = useUser();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHabitProgress = async () => {
            if(!user) {
                return;
            }
            try {
                const data = await UserHabitService.getAllUserHabits(user.id);
                setHabits(data);
            } catch (err) {
                console.error("Ошибка загрузки привычек:", err);
                setError("Не удалось загрузить данные. Попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };

        fetchHabitProgress();
    }, [user]);

    const calculateProgressPercentage = (completed, duration) => {
        return duration > 0 ? Math.min((completed / duration) * 100, 100) : 0;
    };

    const achievedGoals = habits?.filter(habit => habit.progress.status === "achieved");
    const unachievedGoals = habits?.filter(habit => habit.progress.status !== "achieved");

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    if (!habits.length) {
        return <div className="empty-message">
            У вас пока нет привычек. Создайте ее!
            <AddHabitButton />
        </div>;
    }

    return (
        <div className="goals-dashboard">
            <div className="goals-summary">
                <h2 className="goals-title">Ваши цели</h2>
                <div className="goals-circle">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle
                            className="goal-circle-background"
                            cx="60"
                            cy="60"
                            r="54"
                            strokeWidth="12"
                        />
                        <circle
                            className="goal-circle-progress"
                            cx="60"
                            cy="60"
                            r="54"
                            strokeWidth="12"
                            strokeDasharray="339.292"
                            strokeDashoffset={(1 - achievedGoals.length / habits.length) * 339.292}
                        />
                    </svg>
                    <div className="percentage-text">
                        {Math.round((achievedGoals.length / habits.length) * 100)}%
                    </div>
                </div>
                <p className="goals-achieved">
                    ✔ {achievedGoals.length} Цель привычки достигнута
                </p>
                <p className="goals-not-achieved">
                    ✖ {unachievedGoals.length} Цель привычки не достигнута
                </p>
            </div>
            <div className="habit-list">
                {habits.map(habitData => (
                    <HabitCard
                        key={habitData.habit.id}
                        habitData={habitData}
                        calculateProgress={calculateProgressPercentage}
                    />
                ))}
            </div>
            {/*<div className="goals-see-all">*/}
            {/*    <a href="#">See All</a>*/}
            {/*</div>*/}
        </div>
    );
};

const HabitCard = ({ habitData, calculateProgress }) => {
    const { habit, progress } = habitData;
    const progressPercentage = calculateProgress(progress.completed_days, habit.duration_days);

    return (
        <div className="goal-card">
            <div className="habit-progress-circle">
                <svg width="50" height="50" viewBox="0 0 50 50">
                    <circle
                        className="habit-circle-background"
                        cx="25"
                        cy="25"
                        r="20"
                        strokeWidth="5"
                    />
                    <circle
                        className="habit-circle-progress"
                        cx="25"
                        cy="25"
                        r="20"
                        strokeWidth="5"
                        strokeDasharray="125.6"
                        strokeDashoffset={(1 - progressPercentage / 100) * 125.6}
                    />
                </svg>
                <div className="habit-percentage-text">
                    {Math.round(progressPercentage)}%
                </div>
            </div>
            <div className="habit-info">
                <h3 className="habit-title">{habit.title}</h3>
                <p className="habit-status">
                    {progress.status === "achieved" ? (
                        <span className="status-achieved">Достигнута</span>
                    ) : (
                        <span className="status-unachieved">Не достигнута</span>
                    )}
                </p>
                <p className="habit-details">
                    {progress.completed_days} из {habit.duration_days} дней
                </p>
            </div>
        </div>
    );
};

export default GoalsDashboard;