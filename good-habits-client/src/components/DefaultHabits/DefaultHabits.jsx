import React from "react";
import axios from "axios";
import "./DefaultHabits.css";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import {api} from "@/lib/request.js"; // Стили компонента

const DefaultHabits = () => {
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Заглушка для user_id

    // Замоканные дефолтные привычки
    const defaultHabits = [
        {
            id: "1",
            title: "Пить воду каждый день",
            description: "Пейте не менее 8 стаканов воды в день.",
            duration_days: 30,
            goal: "Поддерживать водный баланс",
        },
        {
            id: "2",
            title: "Утренняя зарядка",
            description: "Начните день с 10-минутной зарядки.",
            duration_days: 21,
            goal: "Привычка к физическим нагрузкам",
        },
        {
            id: "3",
            title: "Читать книги каждый день",
            description: "Читайте хотя бы 10 страниц книги каждый день.",
            duration_days: 30,
            goal: "Развивать интеллектуальные способности",
        },
        {
            id: "4",
            title: "Завести дневник",
            description: "Пишите каждый день 5 вещей, за которые вы благодарны.",
            duration_days: 14,
            goal: "Повышение уровня осознанности",
        },
    ];

    // Обработчик нажатия на привычку
    const handleSelectHabit = async (habit) => {
        const payload = {
            user_id: userId,
            title: habit.title,
            description: habit.description,
            duration_days: habit.duration_days,
            goal: habit.goal,
        };

        console.log("Отправляем данные:", payload);

        // Заглушка для запроса на бэк
        try {
            const response = await api.post("/api/habits/custom", payload);
            console.log("Ответ сервера:", response.data);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    // Обработчик для кнопки "Создать свою" (пока ничего не делает)
    const handleCreateCustomHabit = () => {
        console.log("Нажата кнопка 'Создать свою привычку'.");
        // Логика будет добавлена позже
    };

    return (
        <div className="default-habits-container">
            <h1 className="default-habits-title">Выберите привычку из списка</h1>
            <div className="habits-list">
                {defaultHabits.map((habit) => (
                    <div
                        key={habit.id}
                        className="habit-card"
                        onClick={() => handleSelectHabit(habit)}
                    >
                        <h2 className="habit-title">{habit.title}</h2>
                        <p className="habit-description">{habit.description}</p>
                        <span className="habit-duration">
                            Длительность: {habit.duration_days} дней
                        </span>
                        <span className="habit-goal">Цель: {habit.goal}</span>
                    </div>
                ))}
            </div>
            {/* Кнопка "Создать свою" */}
            <Button text="Создать свою" onClick={handleCreateCustomHabit} />
        </div>
    );
};

export default DefaultHabits;
