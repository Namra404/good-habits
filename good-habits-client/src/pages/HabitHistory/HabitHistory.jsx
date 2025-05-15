import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./HabitHistory.css";
import UserService from "@/services/User.jsx";
import UserHabitService from "@/services/UserHabit.jsx";
import {useUser} from "@/store/user-provider.jsx";


const HabitHistory = () => {
    const {user} = useUser();
    const userId = user?.id;
    const [habitHistory, setHabitHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedHabits, setExpandedHabits] = useState({});
    const [expandedCheckIns, setExpandedCheckIns] = useState({});
    const [visibleCheckIns, setVisibleCheckIns] = useState({});
    const checkInsPerPage = 5;

    useEffect(() => {
        const fetchHabitHistory = async () => {
            try {
                const data = await UserHabitService.getAllUserHabits(userId, "in_progress");
                setHabitHistory(data);
            } catch (err) {
                setError("Failed to fetch habit history");
            } finally {
                setLoading(false);
            }
        };
        fetchHabitHistory();
    }, [userId]);

    const toggleHabitDetails = (habitId) => {
        setExpandedHabits((prev) => ({
            ...prev,
            [habitId]: !prev[habitId]
        }));
    };

    const toggleCheckIns = (progressId) => {
        setExpandedCheckIns((prev) => ({
            ...prev,
            [progressId]: !prev[progressId]
        }));
        setVisibleCheckIns((prev) => ({
            ...prev,
            [progressId]: checkInsPerPage
        }));
    };

    const loadMoreCheckIns = (progressId, total) => {
        setVisibleCheckIns((prev) => ({
            ...prev,
            [progressId]: Math.min(prev[progressId] + checkInsPerPage, total)
        }));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="habit-history-container">
            <h1 className="title">История привычек</h1>
            {habitHistory.length === 0 ? (
                <p className="no-data">Нет выполненых привычек.</p>
            ) : (
                <ul className="history-habit-list">
                    {habitHistory.map(({ progress, habit }) => (
                        <li key={progress.id} className="history-habit-item">
                            <h2 onClick={() => toggleHabitDetails(habit.id)} className="history-habit-title">
                                {habit.title} {expandedHabits[habit.id] ? "▲" : "▼"}
                            </h2>
                            {expandedHabits[habit.id] && (
                                <div className="history-habit-details">
                                    <p><strong>Описание:</strong> {habit.description}</p>
                                    <p><strong>Цель:</strong> {habit.goal}</p>
                                    <p><strong>Продолжительность:</strong> {habit.duration_days} дней</p>
                                </div>
                            )}
                            <p className="progress-info">Выполненные дни: {progress.completed_days} / {habit.duration_days}</p>
                            <p className="progress-date">Дата старта: {new Date(progress.start_date).toLocaleDateString()}</p>
                            <h3 onClick={() => toggleCheckIns(progress.id)} className="checkins-toggle">
                                Чек-ины {expandedCheckIns[progress.id] ? "▲" : "▼"}
                            </h3>
                            {expandedCheckIns[progress.id] && (
                                <ul className="history-check-in-list">
                                    {progress.check_ins.slice(0, visibleCheckIns[progress.id] || checkInsPerPage).map((checkIn) => (
                                        <li key={checkIn.id} className={`history-check-in-item ${checkIn.is_completed ? "history-completed" : "history-not-completed"}`}>
                                            <p className="check-in-date">{new Date(checkIn.check_in_date).toLocaleDateString()}</p>
                                            <p className="check-in-number">Check-in: {checkIn.check_in_number}</p>
                                            <p className="check-in-status">{checkIn.is_completed ? "✅ Выполнен" : "❌ Не выполнен"}</p>
                                        </li>
                                    ))}
                                    {progress.check_ins.length > (visibleCheckIns[progress.id] || checkInsPerPage) && (
                                        <button onClick={() => loadMoreCheckIns(progress.id, progress.check_ins.length)} className="load-more-button">
                                            Ещё
                                        </button>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HabitHistory;
