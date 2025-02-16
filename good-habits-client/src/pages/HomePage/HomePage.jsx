import React, { useEffect, useState } from "react";
import HabitTrackerList from "@/components/UI-kit/habit-tracker-list/HabitTrackerList.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";
import GoalHabitsList from "@/components/GoalHabitsList/GoalHabitsList.jsx";
import "./HomePage.css";
import UserHabitService from "@/services/UserHabit.jsx";
import UserService from "@/services/User.jsx";
import {useUser} from "@/store/user-provider.jsx";

function HomePage() {
    const [habitsData, setHabitsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {user} = useUser();
    useEffect(() => {
        const fetchHabitsAndProgress = async () => {
            try {
                // Получаем замоканный user_id

                // Один запрос для получения привычек и прогресса
                const fetchedData = await UserHabitService.getAllUserHabits(user, "in_progress");
                setHabitsData(fetchedData);
            } catch (error) {
                console.error("Failed to fetch habits and progress:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHabitsAndProgress();
    }, []);

    const currentDate = new Date().toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home_page page">
            <div className="date_container">
                <h2 className="current_date">{currentDate}</h2>
            </div>
            <div className="header_container">
                <h1 className="header_text">Hello, User!</h1>
                <p className="subheader_text">
                    {habitsData.filter((h) => h.progress.completed_days > 0).length} of{" "}
                    {habitsData.length} habits completed today!
                </p>
            </div>
            <div className="habit_tracker_list">
                <HabitTrackerList />
            </div>
            <div className="goal_habits_list">
                <GoalHabitsList habitsData={habitsData} />
            </div>
            <AddHabitButton />
        </div>
    );
}

export default HomePage;
