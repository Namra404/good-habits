import React, { useEffect, useState } from "react";
import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import HabitProgress from "@/components/UI-kit/habit-progress/HabitProgress.jsx";
import "./HabitTrackerList.css";
import CheckinService from "@/services/Сheckin.jsx";
import UserService from "@/services/User.jsx";

function HabitTrackerList() {
    const [checkIns, setCheckIns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = UserService.getMockedUserId();

    useEffect(() => {
        const fetchCheckIns = async () => {
            try {
                // Выполняем запрос для получения чек-инов
                const fetchedCheckIns = await CheckinService.getTodayCheckIns(userId);
                setCheckIns(fetchedCheckIns || []); // Если ответ пустой, устанавливаем пустой массив
            } catch (error) {
                console.error("Failed to fetch check-ins:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCheckIns();
    }, [userId]);

    const onCheckInChange = (id, newStatus) => {
        setCheckIns((state) =>
            state.map((check_in) =>
                check_in.id === id
                    ? { ...check_in, is_completed: newStatus }
                    : check_in
            )
        );
    };

    const totalHabits = checkIns.length;
    const completedHabits = checkIns.filter((habit) => habit.is_completed).length;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="habit-tracker-list">
            <HabitProgress totalHabits={totalHabits} completedHabits={completedHabits} />
            <div className="header">
                <h1 className="title">Today Habit</h1>
                <a className="see_all">See all</a>
            </div>
            <div className="habit-list">
                {checkIns.length > 0 ? (
                    checkIns.map((check_in) => (
                        <HabitTracker
                            key={check_in.id}
                            check_in={check_in}
                            onCheckInChange={onCheckInChange}
                            setCheckIns={setCheckIns}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No habits to track today. Add new habits to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HabitTrackerList;
