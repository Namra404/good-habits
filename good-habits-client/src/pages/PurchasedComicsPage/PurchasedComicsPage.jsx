import React, { useState, useEffect } from "react";

 // Компонент для отображения одного комикса
import "./PurchasedComicsPage.css";
import UserComicService from "@/services/UserComic.jsx";
import ComicCard from "@/components/ComicCard/ComicCard.jsx";
import PurchasedComicCard from "@/components/PurchasedComicCard/PurchasedComicCard.jsx";


const PurchasedComicsPage = () => {
    const [purchasedComics, setPurchasedComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedComics = async () => {
            try {
                // Эмуляция запроса к серверу
                const response = await fetch("http://localhost:8000/user_comics/user/3fa85f64-5717-4562-b3fc-2c963f66afa6");
                const data = await response.json();
                setPurchasedComics(data);
            } catch (error) {
                console.error("Ошибка при загрузке купленных комиксов:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchasedComics();
    }, []);

    if (isLoading) {
        return <div className="loading">Загрузка купленных комиксов...</div>;
    }

    if (purchasedComics.length === 0) {
        return <div className="empty-state">У вас пока нет купленных комиксов.</div>;
    }

    return (
        <div className="purchased-comics-page">
            <h1 className="page-title">Мои Купленные Комиксы</h1>
            <div className="comics-list">
                {purchasedComics.map((comic) => (
                    <PurchasedComicCard key={comic.user_comic_id} comic={comic} />
                ))}
            </div>
        </div>
    );
};

export default PurchasedComicsPage;
