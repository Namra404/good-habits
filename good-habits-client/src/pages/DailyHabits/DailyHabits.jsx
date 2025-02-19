import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import DateSelector from "@/components/DateSelector/DateSelector.jsx";
import {api} from "@/lib/request.js";
import { useState, useEffect } from "react"
import CheckinService from "@/services/Сheckin.jsx";
import "./DailyHabits.css";
import {useUser} from "@/store/user-provider.jsx";

const DailyHabits = () => {
    const [selectedDate, setSelectedDate] = useState(getCurrentWeek()[0]); // Начало недели
    const [checkIns, setCheckIns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useUser();
    const userId = user?.id;
    useEffect(() => {
        const loadHabits = async () => {
            setIsLoading(true);
            try {
                const response = await CheckinService.getTodayCheckIns(userId, selectedDate);
                setCheckIns(response || []);
            } catch (error) {
                console.error("Ошибка при загрузке привычек:", error);
            } finally {
                setIsLoading(false);
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
        <div className="daily-habits">
            <DateSelector
                dates={getCurrentWeek()}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="habit-list">
                    {checkIns.length > 0 ? (
                        checkIns.map((check_in) => (
                            <HabitTracker
                                key={check_in.id}
                                check_in={check_in}
                                onCheckInChange={onCheckInChange}
                            />
                        ))
                    ) : (
                        <div className="empty-state">No habits for this day.</div>
                    )}
                </div>
            )}
        </div>
    );
};

const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date.toISOString().split("T")[0]); // Формат YYYY-MM-DD
    }
    return dates;
};

export default DailyHabits;