import React, { useEffect, useState } from "react";
import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import HabitProgress from "@/components/UI-kit/habit-progress/HabitProgress.jsx";
import "./HabitTrackerList.css";
import CheckinService from "@/services/Сheckin.jsx";
import UserService from "@/services/User.jsx";
import {useUser} from "@/store/user-provider.jsx";
import {useNavigate} from "react-router-dom";
// const {user} = useUser();
// const userId = user?.id; // Заглушка для user_id
// const userId = UserService.getMockedUserId();
function HabitTrackerList() {
    const [checkIns, setCheckIns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const userId = user?.id;
    const navigate = useNavigate(); // Хук для навигации
    // const userId = UserService.getMockedUserId();

    useEffect(() => {
        const fetchCheckIns = async () => {
            try {
                const fetchedCheckIns = await CheckinService.getTodayCheckIns(userId);
                setCheckIns(fetchedCheckIns || []);
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
                check_in.id === id ? { ...check_in, is_completed: newStatus } : check_in
            )
        );
    };

    const groupedCheckIns = checkIns.reduce((acc, check_in) => {
        if (!acc[check_in.progress_id]) acc[check_in.progress_id] = [];
        acc[check_in.progress_id].push(check_in);
        return acc;
    }, {});

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="habit-tracker-list">
            <HabitProgress
                totalHabits={checkIns.length}
                completedHabits={checkIns.filter((habit) => habit.is_completed).length}
            />
            <div className="header">
                <h1 className="title">Задачи сегодня</h1>
                <a className="see_all" onClick={() => navigate("/daily-habits")} >См. все</a>
            </div>
            <div className="habit-list">
                {Object.values(groupedCheckIns).flat().length > 0 ? (
                    Object.values(groupedCheckIns).map((group) =>
                        group.map((check_in, index) => {
                            const previousCheckIn = group[index - 1];
                            return (
                                <HabitTracker
                                    key={check_in.id}
                                    check_in={check_in}
                                    onCheckInChange={onCheckInChange}
                                    setCheckIns={setCheckIns}
                                    previousCompleted={!previousCheckIn || previousCheckIn.is_completed}
                                />
                            );
                        })
                    )
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