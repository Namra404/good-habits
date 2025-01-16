import React, {useEffect, useState} from "react";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx"; // Ваш компонент Button
import "./LinkHabitToUser.css";
import {api} from "@/lib/request.js";
import {useNavigate} from "react-router-dom";
import crossSVG from "@/assets/cross.svg";
import HabitService from "@/services/Habit.jsx"; // Стили компонента
const LinkHabitToUser = () => {
    const navigate = useNavigate();

    const [habits, setHabits] = useState([]);
    const [habitId, setHabitId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [checkinAmount, setCheckinAmount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Заглушка для user_id

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const data = await HabitService.getAllHabits();
                setHabits(data);
            } catch (err) {
                console.error("Ошибка при загрузке привычек:", err);
                setError("Не удалось загрузить привычки.");
            } finally {
                setLoading(false);
            }
        };

        fetchHabits();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            habit_id: habitId,
            user_id: userId,
            start_date: new Date(startDate).toISOString(),
            last_check_in_date: new Date(startDate).toISOString(),
            checkin_amount_per_day: checkinAmount,
            status: "start",
            reward_coins: 1,
            completed_days: 0,
            check_ins: [],
        };

        console.log("Отправляем данные:", payload);

        try {
            const response = await api.post("/user_habit_progress/", payload);
            console.log("Ответ сервера:", response.data);
            navigate("/success");
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    };

    if (loading) return <p>Загрузка привычек...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="form-container">
            <h1 className="form-title">Create New Habit Goal</h1>
            <form onSubmit={handleSubmit} className="habit-form">
                <label className="form-label">Select Habit</label>
                <select
                    className="form-select"
                    value={habitId}
                    onChange={(e) => setHabitId(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select a habit
                    </option>
                    {habits.map((habit) => (
                        <option key={habit.id} value={habit.id}>
                            {habit.title}
                        </option>
                    ))}
                    <option value="" onClick={(e) => {
                        e.stopPropagation();
                        navigate("/custom-habit");
                    }} className="create-new">
                        + Create new
                    </option>
                </select>

                <label className="form-label">Start Date</label>
                <input
                    className="form-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />

                <label className="form-label">Check-ins per Day</label>
                <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="10"
                    value={checkinAmount}
                    onChange={(e) => setCheckinAmount(e.target.value)}
                    required
                />

                <Button text="Create New" type="submit" color="orange" />
            </form>
        </div>
    );
};

export default LinkHabitToUser;