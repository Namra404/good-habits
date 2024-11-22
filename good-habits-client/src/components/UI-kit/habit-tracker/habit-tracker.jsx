import empty_checkbox from "@/assets/empty_checkbox.svg";
import green_checkbox from "@/assets/green_checkbox.svg";
import three_points from "@/assets/three_points.svg";
import './habit-tracker.css';
import {useRef, useState} from "react";
import useClickOutside from "@/hooks/useClickOutside.jsx";



function HabitTracker({ check_in, onCheckInChange }) {
    if (!check_in) {
        return <div className="habit-tracker">No data available</div>;
    }
    const [isOpen, setIsOpen] = useState(false)
     const menuRef = useRef(null);


    const { id, title, is_completed, check_in_number } = check_in;
    useClickOutside(menuRef, () => setIsOpen(false))
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
                onClick={() => onCheckInChange(id, !is_completed)}
            />
            <img className="three-points" src={three_points} alt="Options" onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className='menuRef' ref={menuRef}>
                    <div>
                        Edit
                    </div>
                    <div>
                        Delete
                    </div>
                </div>
            )}
        </div>
    );
}

export default HabitTracker;