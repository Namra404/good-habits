import React, {useEffect, useState} from "react";

import "./ComicsStore.css";
import ComicCard from "@/components/ComicCard/ComicCard.jsx";
import ComicService from "@/services/Сomic.jsx";
import UserComicService from "@/services/UserComic.jsx";
import UserService from "@/services/User.jsx";
import {useUser} from "@/store/user-provider.jsx";

const ComicsStore = () => {
    const { user } = useUser();
    const userId = user?.id;
    const [coins, setCoins] = useState(0);
    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserDataAndComics = async () => {
            try {
                const user = await UserService.getUserById(userId);
                setCoins(user.coin_balance);
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

    const handleBuyComic = async (comic) => {
        if (coins < comic.price) {
            alert("Недостаточно монет!");
            return;
        }

        try {
            await UserComicService.addUserComic({
                user_id: userId,
                comic_id: comic.id,
            });

            setCoins((prevCoins) => prevCoins - comic.price);
            alert("Комикс успешно куплен!");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorDetail = error.response.data.detail;

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
                <h1>Магазин комиксов</h1>
                <div className="coins-display">
                    💰 Баланс: <span>{coins}</span>
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
