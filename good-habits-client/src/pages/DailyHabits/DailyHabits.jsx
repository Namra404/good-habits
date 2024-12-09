import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import DateSelector from "@/components/DateSelector/DateSelector.jsx";
import {api} from "@/lib/request.js";
import { useState, useEffect } from "react"

const DailyHabits = () => {
    const [selectedDate, setSelectedDate] = useState("2024-03-01");
    const [checkIns, setCheckIns] = useState([
        { id: 1, title: "Meditating", is_completed: true, check_in_number: 1 },
        { id: 2, title: "Read Philosophy", is_completed: true, check_in_number: 2 },
        { id: 3, title: "Journaling", is_completed: false, check_in_number: 3 },
    ]);

    useEffect(() => {
        const loadHabits = async () => {
            try {
                // Заглушка: передайте дату как payload
                const payload = { date: selectedDate };
                const response = await api.post("/api/habits/by_date", payload);

                // Временно логируем ответ
                console.log("API response:", response.data);

                // Для дальнейшей реализации: раскомментируйте для обновления checkIns
                // setCheckIns(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке привычек:", error);
            }
        };

        loadHabits();
    }, [selectedDate]);

    const onCheckInChange = (id, newStatus) => {
        setCheckIns((state) =>
            state.map((check_in) =>
                check_in.id === id
                    ? { ...check_in, is_completed: newStatus }
                    : check_in
            )
        );
    };

    return (
        <div>
            <DateSelector onDateChange={setSelectedDate} />
            <div className="habit-list">
                {checkIns.map((check_in) => (
                    <HabitTracker
                        key={check_in.id}
                        check_in={check_in}
                        onCheckInChange={onCheckInChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyHabits;