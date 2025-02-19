import React from "react";
import './ComicCard.css'
const ComicCard = ({ comic, onBuy }) => {
    const { title, description, price } = comic;

    return (
        <div className="comic-card">
            <h2 className="comic-title">{title}</h2>
            <p className="comic-description">{description}</p>
            <div className="comic-footer">
                <span className="comic-price">{price} монеты</span>
                <button className="buy-button" onClick={onBuy}>
                    Купить
                </button>
            </div>
        </div>
    );
};

export default ComicCard;
