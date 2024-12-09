import React from 'react';
import './HabitGoalProgress.css'; // CSS для стилей


const HabitGoalProgress = ({ habitData }) => {
    return (
        <div className="habit-progress-list">
            {habitData.map(({ habit, progress }) => (
                <div key={habit.id} className="habit-goal-progress-item">
                    <div className="progress-goal-circle">
                        <svg width="50" height="50" viewBox="0 0 100 100">
                            <circle
                                className="circle-goal-background"
                                cx="50"
                                cy="50"
                                r="45"
                                strokeWidth="10"
                            />
                            <circle
                                className="circle-habit-progress"
                                cx="50"
                                cy="50"
                                r="45"
                                strokeWidth="10"
                                strokeDasharray="282"
                                strokeDashoffset={
                                    (1 - progress.completed_days / habit.duration_days) * 282
                                }
                            />
                        </svg>
                        <div className="goal-percentage">{Math.round((progress.completed_days / habit.duration_days) * 100)}%</div>
                    </div>
                    <div className="habit-details">
                        <h3 className="habit-title">{habit.title}</h3>
                        <p className="habit-target">{progress.completed_days} from {habit.duration_days} days target</p>
                    </div>
                    <div className={progress.status === 'achieved' ? 'habit-status-achieved' : 'habit-status-unachieved'}>
                        {progress.status === 'achieved' ? 'Achieved' : 'Unachieved'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HabitGoalProgress;