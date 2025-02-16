import React, {useEffect, useState} from "react";

import "./ComicsStore.css";
import ComicCard from "@/components/ComicCard/ComicCard.jsx";
import ComicService from "@/services/Сomic.jsx";
import UserComicService from "@/services/UserComic.jsx";
import UserService from "@/services/User.jsx";

const ComicsStore = () => {
    const userId = UserService.getMockedUserId(); // Получение замоканного ID пользователя
    const [coins, setCoins] = useState(0); // Баланс пользователя
    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Загружаем данные о пользователе и комиксах
    useEffect(() => {
        const fetchUserDataAndComics = async () => {
            try {
                // Загружаем баланс пользователя
                const user = await UserService.getUserById(userId); // API для получения пользователя
                setCoins(user.coin_balance);

                // Загружаем список комиксов
                const allComics = await ComicService.getAllComics();
                setComics(allComics);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDataAndComics();
    }, [userId]);

    // Покупка комикса
    const handleBuyComic = async (comic) => {
        if (coins < comic.price) {
            alert("Недостаточно монет!");
            return;
        }

        try {
            // Отправляем запрос на добавление комикса пользователю
            await UserComicService.addUserComic({
                user_id: userId,
                comic_id: comic.id,
            });

            // Обновляем баланс локально
            setCoins((prevCoins) => prevCoins - comic.price);
            alert("Комикс успешно куплен!");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorDetail = error.response.data.detail;

                // Обработка сообщений об ошибках
                if (errorDetail.includes("has already purchased comic")) {
                    alert("Вы уже купили этот комикс!");
                } else if (errorDetail.includes("insufficient balance")) {
                    const match = errorDetail.match(/Required: (\d+), Available: (\d+)/);
                    if (match) {
                        const required = match[1];
                        const available = match[2];
                        alert(`Недостаточно монет! Необходимо: ${required}, доступно: ${available}.`);
                    } else {
                        alert("Недостаточно монет!");
                    }
                } else {
                    alert("Ошибка: " + errorDetail);
                }
            } else {
                console.error("Ошибка при покупке комикса:", error);
                alert("Не удалось купить комикс. Попробуйте снова.");
            }
        }
    };

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div className="comics-store">
            <header className="store-header">
                <h1>Comics Store</h1>
                <div className="coins-display">
                    Coins: <span>{coins}</span>
                </div>
            </header>
            <div className="comics-list">
                {comics.map((comic) => (
                    <ComicCard
                        key={comic.id}
                        comic={comic}
                        onBuy={() => handleBuyComic(comic)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ComicsStore;