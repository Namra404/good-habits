import React, {useState} from "react";
import axios from "axios";
import "./DefaultHabits.css";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import {api} from "@/lib/request.js";
import {useNavigate} from "react-router-dom";
import UserHabitService from "@/services/UserHabit.jsx";
import HabitService from "@/services/Habit.jsx";
import log from "eslint-plugin-react/lib/util/log.js"; // Стили компонента

const DefaultHabits = () => {
    const userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Заглушка для user_id
    const navigate = useNavigate();
    // Замоканные дефолтные привычки
    const defaultHabits = [
        {
            title: "Пить воду каждый день",
            description: "Пейте не менее 8 стаканов воды в день.",
            duration_days: 30,
            goal: "Поддерживать водный баланс",
        },
        {
            title: "Утренняя зарядка",
            description: "Начните день с 10-минутной зарядки.",
            duration_days: 21,
            goal: "Привычка к физическим нагрузкам",
        },
        {
            title: "Читать книги каждый день",
            description: "Читайте хотя бы 10 страниц книги каждый день.",
            duration_days: 30,
            goal: "Развивать интеллектуальные способности",
        },
        {
            title: "Завести дневник",
            description: "Пишите каждый день 5 вещей, за которые вы благодарны.",
            duration_days: 14,
            goal: "Повышение уровня осознанности",
        },
    ];

    // Обработчик нажатия на привычку
    const handleSelectHabit = async (habit) => {
        try {
            // Создание привычки через HabitService
            const habitId = await HabitService.createHabit({
                user_id: userId,
                title: habit.title,
                description: habit.description,
                duration_days: habit.duration_days,
                goal: habit.goal,
            });
            console.log(habitId)

            // Получаем текущую дату в ISO формате
            const currentDate = new Date().toISOString();

            // Создание прогресса привычки через UserHabitService
            const progressResponse = await UserHabitService.createHabitProgress({
                habit_id: habitId, // Идентификатор привычки из первого запроса
                user_id: userId,
                start_date: currentDate,
                last_check_in_date: currentDate,
                checkin_amount_per_day: 2,
                status: "start",
                reward_coins: 1,
                completed_days: 0,
                check_ins: [],
            });

            console.log("Привычка успешно добавлена:", progressResponse);
            navigate('/goal-added')
        } catch (error) {
            console.error("Ошибка при добавлении привычки или прогресса:", error);
        }
    };

    // Обработчик для кнопки "Создать свою" (пока ничего не делает)
    const handleCreateCustomHabit = () => {
        navigate('/new-goal');

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
