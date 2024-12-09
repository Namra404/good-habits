import HabitTrackerList from "@/components/UI-kit/habit-tracker-list/HabitTrackerList.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";
import GoalHabitsList from "@/components/GoalHabitsList/GoalHabitsList.jsx";
import './HomePage.css'
function HomePage() {
    const mockHabits = [
        {
            created_at: "2024-11-30T09:40:20.466955Z",
            updated_at: "2024-11-30T09:40:20.466955Z",
            id: "f7b22157-b4b9-4b6f-944b-6e53822c0b84",
            user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            title: "Finish 5 Philosophy Books",
            description: "Read and finish 5 philosophy books in 7 days.",
            duration_days: 7,
            goal: "5 books",
        },
    ];

    const mockProgress = [
        {
            id: "f480bccb-6caf-43ce-8245-8d5a7289ff0e",
            habit_id: "f7b22157-b4b9-4b6f-944b-6e53822c0b84",
            user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            start_date: "2024-11-22T07:27:15.092000Z",
            last_check_in_date: null,
            checkin_amount_per_day: 2,
            status: "in_progress",
            reward_coins: 5,
            completed_days: 6,
            check_ins: [],
        },
    ];


    const currentDate = new Date().toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="home_page page">
            {/* Отображение текущей даты */}
            <div className="date_container">
                <h2 className="current_date">{currentDate}</h2>
            </div>

            {/* Приветствие */}
            <div className="header_container">
                <h1 className="header_text">Hello, Susy!</h1>
                <p className="subheader_text">3 of 5 habits completed today!</p>
            </div>

            {/* Список привычек */}
            <div className="habit_tracker_list">
                <HabitTrackerList />
            </div>

            {/* Цели */}
            <div className="goal_habits_list">
                <GoalHabitsList habits={mockHabits} progress={mockProgress} />
            </div>

            {/* Кнопка добавления */}
            <AddHabitButton />
        </div>
    );
}

export default HomePage;