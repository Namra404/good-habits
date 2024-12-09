import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HabitGoalProgress from '@/components/HabitProgress/HabitGoalProgress.jsx';
import './GoalsDashboard.css';

const GoalsDashboard = () => {
    const [habitData, setHabitData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHabitData = async () => {
            try {
                // Имитация получения данных с бэка
                const response = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            data: [
                                {
                                    habit: {
                                        id: 'f7b22157-b4b9-4b6f-944b-6e53822c0b84',
                                        title: 'Journaling Everyday',
                                        description: 'Write in your journal every day.',
                                        duration_days: 5,
                                        goal: 'Write daily to improve mindfulness',
                                    },
                                    progress: {
                                        status: 'achieved',
                                        completed_days: 1,
                                        check_ins: [
                                            {
                                                id: 'f4ed7364-16c3-43f8-93f0-e61aae5f2507',
                                                check_in_date: '2024-11-22T07:27:15.092000Z',
                                                check_in_number: 1,
                                                is_completed: true,
                                            },
                                            {
                                                id: 'e8f2ab0c-42a9-4a18-bfb6-4b59bc352e1c',
                                                check_in_date: '2024-11-22T07:27:15.092000Z',
                                                check_in_number: 2,
                                                is_completed: false,
                                            },
                                            // Другие данные check-in...
                                        ],
                                    },
                                },
                                {
                                    habit: {
                                        id: '3baa6169-433b-4a16-8066-d18629078bdd',
                                        title: 'Vitamin',
                                        description: 'Take vitamins every day.',
                                        duration_days: 22,
                                        goal: 'Take vitamins every morning',
                                    },
                                    progress: {
                                        status: 'in_progress',
                                        completed_days: 0,
                                        check_ins: [
                                            {
                                                id: 'e2de7c58-a636-4867-84e7-026c752c01f2',
                                                check_in_date: '2024-12-05T10:26:35.080000Z',
                                                check_in_number: 1,
                                                is_completed: false,
                                            },
                                            {
                                                id: 'b74c478e-f717-4f3a-a361-77333cabfd19',
                                                check_in_date: '2024-12-05T10:26:35.080000Z',
                                                check_in_number: 2,
                                                is_completed: false,
                                            },
                                            // Другие данные check-in...
                                        ],
                                    },
                                },
                            ],
                        });
                    }, 1000);
                });
                setHabitData(response.data);
            } catch (err) {
                setError('Failed to load habit data');
            } finally {
                setLoading(false);
            }
        };

        fetchHabitData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const percentage = 60; // Example percentage for the progress circle

    return (
        <div className="goals-dashboard">
            <div className="goals-summary">
                <h2 className="goals-title">Your Goals</h2>
                <div className="goals-circle">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle
                            className="goal-circle-background"
                            cx="60"
                            cy="60"
                            r="54"
                            strokeWidth="12"
                        />
                        <circle
                            className="goal-circle-progress"
                            cx="60"
                            cy="60"
                            r="54"
                            strokeWidth="12"
                            strokeDasharray="339.292"
                            strokeDashoffset={(1 - percentage / 100) * 339.292}
                        />
                    </svg>
                    <div className="percentage-text">{percentage}%</div>
                </div>
                <p className="goals-achieved">✔ 11 Habits goal has achieved</p>
                <p className="goals-not-achieved">✖ 6 Habits goal hasn’t achieved</p>
            </div>
            <HabitGoalProgress habitData={habitData} />
            <div className="goals-see-all">
                <a href="#">See All</a>
            </div>
        </div>
    );
};

export default GoalsDashboard;
