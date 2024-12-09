import React, { useState } from "react";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx"; // Ваш компонент Button
import "./CreateCustomHabit.css";
import crossSVG from "@/assets/cross.svg";
import {api} from "@/lib/request.js";
import {useNavigate} from "react-router-dom"; // Стили компонента

const CreateCustomHabit = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(""); // Название привычки
    const [description, setDescription] = useState(""); // Описание привычки
    const [duration, setDuration] = useState(1); // Длительность привычки (в днях)
    const [goal, setGoal] = useState(""); // Цель привычки
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Заглушка для user_id

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Данные для отправки на бэк
        const payload = {
            user_id: userId,
            title,
            description,
            duration_days: duration,
            goal,
        };

        console.log("Отправляем данные:", payload);

        // Заглушка для запроса на бэк
        try {
            const response = await api.post("/api/habits/custom", payload);
            console.log("Ответ сервера:", response.data);
            navigate("/new-goal")
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="form-container">
            {/* Кнопка закрытия */}

            <img src={crossSVG} alt="busket" className="close-button" onClick={() => {
                navigate(-1)
            }}/>
            <h1 className="form-title">Создать свою привычку</h1>

            <form onSubmit={handleSubmit} className="habit-form">
                {/* Поле для названия привычки */}
                <label className="form-label">Название привычки</label>
                <input
                    className="form-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название"
                    required
                />

                {/* Поле для описания привычки */}
                <label className="form-label">Описание</label>
                <textarea
                    className="form-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опишите привычку"
                    required
                ></textarea>

                {/* Поле для длительности привычки */}
                <label className="form-label">Длительность (в днях)</label>
                <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="365"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Введите количество дней"
                    required
                />

                {/* Поле для цели привычки */}
                <label className="form-label">Цель</label>
                <input
                    className="form-input"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Опишите цель"
                    required
                />

                {/* Кнопка создания */}
                <Button text="Создать" type="submit" color="orange"/>
            </form>
        </div>
    );
};

export default CreateCustomHabit;
