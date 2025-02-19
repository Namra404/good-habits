import React from "react";

import "./UserProfile.css";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import {useNavigate} from "react-router-dom";
import {useUser} from "@/store/user-provider.jsx";


const UserProfile = () => {
    const navigate = useNavigate();
    const {user} = useUser();


    const handleOpenSettings = () => {
        navigate("/settings");
    };

    const handleViewPurchasedComics = () => {
        navigate("/purchased-comics");
    };

    const handleViewHabitHistory = () => {
        navigate('/habit-history');
    };

    const handleGoToStore = () => {
        navigate("/store");
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <div className="avatar">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="User Avatar"
                            className="user_avatar"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.target.src = "/default-avatar.png"; // Заглушка, если изображение не загрузилось
                            }}
                        />
                    ) : (
                        <img src="/default-avatar.png" alt="Default Avatar" className="user_avatar"/>
                    )}
                </div>
                <div>
                    <h1 className="username">{user?.username || "User"}</h1>
                    <div className="coin-balance">
                        Баланс: <span>{user?.coin_balance}</span>
                    </div>
                </div>
            </div>
            <div className="profile-actions">
                <Button
                    text="Купленные комиксы"
                    onClick={handleViewPurchasedComics}
                    color="orange"
                />
                <Button
                    text="История привычек"
                    onClick={handleViewHabitHistory}
                    color="grey"
                />
                <Button
                    text="Настройки"
                    onClick={handleOpenSettings}
                    color="orange"
                />
                <Button
                    text="Магазин"
                    onClick={handleGoToStore}
                    color="blue"
                />
            </div>
        </div>
    );
};

export default UserProfile;