import GoalHabitsList from "@/components/GoalHabitsList/GoalHabitsList.jsx";
import UserService from "@/services/User.jsx";
import UserHabitService from "@/services/UserHabit.jsx";
import {useEffect, useState} from "react";

const AllGoals = () => {
    const [habitsData, setHabitsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHabitsAndProgress = async () => {
            try {
                // Получаем замоканный user_id
                const userId = UserService.getMockedUserId();

                // Один запрос для получения привычек и прогресса
                const fetchedData = await UserHabitService.getAllUserHabits(userId);
                setHabitsData(fetchedData);
            } catch (error) {
                console.error("Failed to fetch habits and progress:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHabitsAndProgress().then(r => {});
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <GoalHabitsList habitsData={habitsData} />
        </div>
    );
};

export default AllGoals;