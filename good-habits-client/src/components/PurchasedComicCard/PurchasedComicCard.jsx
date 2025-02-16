import React from "react";
import "./PurchasedComicCard.css";

const PurchasedComicCard = ({ comic }) => {
    const { title, description, price, purchase_date } = comic;

    return (
        <div className="purchased-comic-card">
            <h2 className="comic-title">{title}</h2>
            <p className="comic-description">{description}</p>
            <p className="comic-price">Цена: {price} монет</p>
            <p className="comic-date">
                Дата покупки: {new Date(purchase_date).toLocaleDateString()}
            </p>
        </div>
    );
};

export default PurchasedComicCard;
