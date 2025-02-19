import React, { useState, useEffect } from "react";

 // Компонент для отображения одного комикса
import "./PurchasedComicsPage.css";
import UserComicService from "@/services/UserComic.jsx";
import ComicCard from "@/components/ComicCard/ComicCard.jsx";
import PurchasedComicCard from "@/components/PurchasedComicCard/PurchasedComicCard.jsx";
import {useUser} from "@/store/user-provider.jsx";


const PurchasedComicsPage = () => {
    const { user } = useUser();
    const userId = user?.id;
    const [purchasedComics, setPurchasedComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchasedComics = async () => {
            if (!userId) {
                setError("Ошибка: Не передан ID пользователя.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await UserComicService.getUserComics(userId);
                setPurchasedComics(data);
            } catch (err) {
                console.error("Ошибка при загрузке купленных комиксов:", err);
                setError("Не удалось загрузить купленные комиксы.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchasedComics();
    }, [userId]);

    if (isLoading) {
        return <div className="loading">Загрузка купленных комиксов...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (purchasedComics.length === 0) {
        return <div className="empty-state">У вас пока нет купленных комиксов.</div>;
    }

    return (
        <div className="purchased-comics-page">
            <h1 className="page-title">Мои Купленные Комиксы</h1>
            <div className="comics-container">
                {purchasedComics.map((comic) => (
                    <PurchasedComicCard key={comic.user_comic_id} comic={comic} />
                ))}
            </div>
        </div>
    );
};

export default PurchasedComicsPage;