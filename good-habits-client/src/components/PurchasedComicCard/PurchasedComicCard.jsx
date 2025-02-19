import React, {useState} from "react";
import "./PurchasedComicCard.css";
import {useUser} from "@/store/user-provider.jsx";
import UserComicService from "@/services/UserComic.jsx";

const PurchasedComicCard = ({ comic }) => {
    const { title, description, price, purchase_date, comic_id } = comic;
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    const { user } = useUser();
    const userId = user?.id;

    const handleSendToTelegram = async () => {
        setIsSending(true);
        setMessage("");
        setError(null);

        try {
            const response = await UserComicService.sendComicToUser(userId, comic_id);
            setMessage(response.message);
        } catch (err) {
            console.error("Ошибка при отправке в Telegram:", err);
            setError(err.message || "Неизвестная ошибка при отправке комикса."); // 🔹 Логируем и сохраняем ошибку
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="purchased-comic-card">
            <h2 className="comic-title">{title}</h2>
            <p className="comic-description">{description}</p>
            <p className="comic-price">Цена: {price} монет</p>
            <p className="comic-date">
                Дата покупки: {new Date(purchase_date).toLocaleDateString()}
            </p>

            {/* Кнопка отправки в Telegram */}
            <button
                className="send-to-telegram-btn"
                onClick={handleSendToTelegram}
                disabled={isSending}
            >
                {isSending ? "Отправка..." : "Отправить в Telegram"}
            </button>

            {/* Сообщение о статусе */}
            {message && <p className="status-message success">{message}</p>}

            {/* 🔹 Отображение ошибки в отладочном `div` */}
            {error && (
                <div className="error-message debug">
                    <p>⚠ Ошибка: {error}</p>
                </div>
            )}
        </div>
    );
};

export default PurchasedComicCard;
