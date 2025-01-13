import React from "react";

import "./UserProfile.css";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import {useNavigate} from "react-router-dom";

const UserProfile = ({ user }) => {
    const navigate = useNavigate();

    const handleOpenSettings = () => {
        navigate('/settings');
    };

    const handleViewPurchasedComics = () => {
        alert("Purchased comics page is under development.");
    };

    const handleViewHabitHistory = () => {
        alert("Habit history page is under development.");
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <div className="avatar"></div>
                <div>
                    <h1 className="username">{user.username || "User"}</h1>
                    <div className="coin-balance">
                        Coin Balance: <span>{user.coin_balance}</span>
                    </div>
                </div>
            </div>
            <div className="profile-actions">
                <Button
                    text="Purchased Comics"
                    onClick={handleViewPurchasedComics}
                    color="orange"
                />
                <Button
                    text="Habit History"
                    onClick={handleViewHabitHistory}
                    color="grey"
                />
                <Button
                    text="Open Settings"
                    onClick={handleOpenSettings}
                    color="orange"
                />
            </div>
        </div>
    );
};

export default UserProfile;
