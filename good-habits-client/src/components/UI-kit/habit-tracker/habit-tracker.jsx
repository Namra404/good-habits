import empty_checkbox from "@/assets/empty_checkbox.svg";
import green_checkbox from "@/assets/green_checkbox.svg";
import three_points from "@/assets/three_points.svg";
import './habit-tracker.css';
import {useRef, useState} from "react";
import useClickOutside from "@/hooks/useClickOutside.jsx";
import DeleteUserHabitPage from "@/pages/DeleteUserHabitPage/DeleteUserHabitPage.jsx";
import CheckinService from "@/services/Сheckin.jsx";



function HabitTracker({ check_in, onCheckInChange, setCheckIns }) {
    if (!check_in) {
        return <div className="habit-tracker">No data available</div>;
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const menuRef = useRef(null);

    const { id, title, is_completed, check_in_number, date: checkInDate } = check_in;

    useClickOutside(menuRef, () => setIsOpen(false));

    // Получение текущей даты в формате YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0];

    // Приведение даты check_in.date к формату YYYY-MM-DD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const handleCheckInChange = async () => {
        // Получаем дату чекина, обрезая время
        const checkInDate = check_in.check_in_date.split("T")[0];

        // Получаем текущую дату в формате YYYY-MM-DD
        const currentDate = new Date().toISOString().split("T")[0];

        // Если дата чек-ина не совпадает с текущей, выходим
        if (checkInDate !== currentDate) {
            alert("You can only check in for today's habits.");
            return;
        }

        const newStatus = !is_completed;

        // Обновляем локальное состояние немедленно
        onCheckInChange(id, newStatus);

        try {
            // Отправляем запрос на сервер
            await CheckinService.updateCheckIn(id, { is_completed: newStatus });
        } catch (error) {
            console.error("Ошибка при обновлении чек-ина:", error);

            // Возвращаем состояние обратно, если запрос не удался
            onCheckInChange(id, is_completed);
        }
    };

    return (
        <div
            className={`habit-tracker ${
                is_completed ? "completed" : "not-completed"
            }`}
        >
            <div className="habit-details">
                <span className="habit-name">{title}</span>
                <span className="check-in-number">{`Check-in #${check_in_number}`}</span>
            </div>
            <img
                src={is_completed ? green_checkbox : empty_checkbox}
                alt={is_completed ? "Completed" : "Not completed"}
                className="checkbox"
                onClick={handleCheckInChange}
            />
            <img
                className="three-points"
                src={three_points}
                alt="Options"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="menuRef" ref={menuRef}>
                    <div>Edit</div>
                    <div onClick={() => setIsDeleteModalOpened(true)}>Delete</div>
                </div>
            )}
            {isDeleteModalOpened && (
                <DeleteUserHabitPage
                    id={id}
                    onClose={() => setIsDeleteModalOpened(false)}
                    setCheckIns={setCheckIns}
                />
            )}
        </div>
    );
}

export default HabitTracker;
