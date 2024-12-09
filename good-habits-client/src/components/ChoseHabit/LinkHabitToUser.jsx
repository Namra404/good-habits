import React, { useState } from "react";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx"; // Ваш компонент Button
import "./LinkHabitToUser.css";
import {api} from "@/lib/request.js";
import {useNavigate} from "react-router-dom";
import crossSVG from "@/assets/cross.svg"; // Стили компонента
const LinkHabitToUser = () => {

    const navigate = useNavigate();

    const [habitId, setHabitId] = useState(""); // ID привычки
    const [startDate, setStartDate] = useState(""); // Дата начала
    const [checkinAmount, setCheckinAmount] = useState(1); // Чек-ины в день
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Заглушка для user_id
    const habits = [
        { id: "f7b22157-b4b9-4b6f-944b-6e53822c0b84", name: "Exercise Daily" },
        { id: "2", name: "Read Books" },
        { id: "3", name: "Drink Water" },
        { id: "4", name: "Sleep Early" }, // Добавлена еще одна привычка
    ]; // Пример списка привычек

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Данные для отправки на бэк
        const payload = {
            habit_id: habitId,
            user_id: userId,
            start_date: new Date(startDate).toISOString(),
            last_check_in_date: new Date(startDate).toISOString(), // Устанавливаем ту же дату для начала
            checkin_amount_per_day: checkinAmount,
            status: "active", // Статус заглушка
            reward_coins: 0, // Заглушка
            completed_days: 0, // Заглушка
            check_ins: [], // Пустой массив
        };

        console.log("Отправляем данные:", payload);

        // Заглушка для запроса на бэк
        try {
            const response = await api.post("/api/habits/link", payload);
            console.log("Ответ сервера:", response.data);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="form-container">
            <img src={crossSVG} alt="busket" className="close-button" onClick={() => {
                navigate(-1)
            }}/>
            <h1 className="form-title">Create New Habit Goal</h1>
            <form onSubmit={handleSubmit} className="habit-form">
                {/* Выбор привычки */}
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
                            {habit.name}
                        </option>
                    ))}
                    <option value="" onClick={(e) => {
                        e.stopPropagation();
                        navigate("/custom-habit")
                    }} className="create-new">
                        + Create new
                    </option>
                </select>

                {/* Поле для даты начала */}
                <label className="form-label">Start Date</label>
                <input
                    className="form-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />

                {/* Поле для количества чек-инов */}
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

                {/* Кнопка создания */}
                <Button text="Create New" type="submit" color="orange"/>
            </form>
        </div>
    );
};

export default LinkHabitToUser;
