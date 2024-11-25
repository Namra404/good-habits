import React from 'react';
import './BigButton.css';


const Button = ({ text = "OK", onClick, type = "button", color = "orange" }) => {
    const buttonClass = color === "grey" ? "big-button default-color" : "big-button";

    return (
        <button
            className={buttonClass}
            type={type}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
