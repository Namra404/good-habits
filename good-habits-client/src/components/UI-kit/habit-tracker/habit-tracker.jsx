import empty_checkbox from "@/assets/empty_checkbox.svg";
import green_checkbox from "@/assets/green_checkbox.svg";
import three_points from "@/assets/three_points.svg";
import './habit-tracker.css';
import {useRef, useState} from "react";
import useClickOutside from "@/hooks/useClickOutside.jsx";
import DeleteUserHabitPage from "@/pages/DeleteUserHabitPage/DeleteUserHabitPage.jsx";
import CheckinService from "@/services/Сheckin.jsx";
import EditUserHabitPage from "@/pages/EditUserHabitPage/EditUserHabitPage.jsx";



function HabitTracker({ check_in, onCheckInChange, setCheckIns, previousCompleted }) {
    if (!check_in) {
        return <div className="habit-tracker">No data available</div>;
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false);
    const menuRef = useRef(null);

    const { id, title, is_completed, check_in_number } = check_in;

    useClickOutside(menuRef, () => setIsOpen(false));

    const handleCheckInChange = async () => {
        // Проверяем, можно ли выполнить чек-ин
        if (!previousCompleted) {
            // alert("Сначала отметьте предыдущий чек-ин!");
            return;
        }

        if (is_completed) {
            // alert("Этот чек-ин уже выполнен!");
            return;
        }

        const newStatus = !is_completed;
        onCheckInChange(id, newStatus);

        try {
            await CheckinService.updateCheckIn(id, { is_completed: newStatus });
        } catch (error) {
            console.error("Ошибка при обновлении чек-ина:", error);
            onCheckInChange(id, is_completed); // Откат в случае ошибки
        }
    };

    return (
        <div className={`habit-tracker ${is_completed ? "completed" : "not-completed"}`}>
            <div className="habit-details">
                <span className="habit-name">{title}</span>
                <span className="check-in-number">{`Check-in #${check_in_number}`}</span>
            </div>

            <div className="actions">
                <img
                    src={is_completed ? green_checkbox : empty_checkbox}
                    alt={is_completed ? "Completed" : "Not completed"}
                    className="checkbox"
                    onClick={handleCheckInChange}
                    style={{
                        opacity: !previousCompleted || is_completed ? 0.5 : 1,
                        cursor: !previousCompleted || is_completed ? "not-allowed" : "pointer",
                    }}
                />

                <img
                    className="three-points"
                    src={three_points}
                    alt="Options"
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <div className="menuRef" ref={menuRef}>
                    <div onClick={() => setIsEditModalOpened(true)}>Изменить</div>
                    <div onClick={() => setIsDeleteModalOpened(true)}>Удалить</div>
                </div>
            )}

            {isDeleteModalOpened && (
                <DeleteUserHabitPage
                    id={id}
                    onClose={() => setIsDeleteModalOpened(false)}
                    setCheckIns={setCheckIns}
                />
            )}
            {isEditModalOpened && (
                <EditUserHabitPage
                    onClose={() => setIsEditModalOpened(false)}
                    initialCheckInDate={check_in.check_in_date}
                    isCompleted={is_completed}
                    checkInId={id}
                    onSuccess={() => {
                        onCheckInChange(id, is_completed); // просто для перерендера
                    }}
                />
            )}
        </div>
    );
}

export default HabitTracker;