import { useState } from "react";
import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import './HabitTrackerList.css'

function HabitTrackerList() {
    const [checkIns, setCheckIns] = useState([
        { id: 1, title: "Meditating", is_completed: true, check_in_number: 1 },
        { id: 2, title: "Read Philosophy", is_completed: true, check_in_number: 2 },
        { id: 3, title: "Journaling", is_completed: false, check_in_number: 3 },
    ]);

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
        <div className="habit-tracker-list">
            <div className="header">
                <h1 className="title">Today Habit</h1>
                <a className="see_all">See all</a>
            </div>
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
}

export default HabitTrackerList;