import React, { useState } from "react";

import "./ComicsStore.css";
import ComicCard from "@/components/ComicCard/ComicCard.jsx";

const ComicsStore = () => {
    const [coins, setCoins] = useState(100); // Внутриигровая валюта
    const [comics] = useState([
        {
            id: "1",
            title: "The Amazing Spider-Man",
            description: "Join Spider-Man on his thrilling adventures in New York City.",
            price: 25,
        },
        {
            id: "2",
            title: "Batman: The Dark Knight",
            description: "Dive into Gotham City's dark alleys with the Dark Knight.",
            price: 30,
        },
        {
            id: "3",
            title: "Wonder Woman: Warrior's Journey",
            description: "Experience the epic journey of Wonder Woman.",
            price: 20,
        },
    ]);

    const handleBuyComic = (price) => {
        if (coins >= price) {
            setCoins(coins - price);
            alert("Comic purchased successfully!");
        } else {
            alert("Not enough coins!");
        }
    };

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
                        onBuy={() => handleBuyComic(comic.price)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ComicsStore;
