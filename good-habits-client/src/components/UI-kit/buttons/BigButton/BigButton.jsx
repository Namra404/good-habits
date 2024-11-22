import React from 'react';
import './BigButton.css';

const Button = ({ text = "OK", onClick, type = 'button'}) => {
    return (
        <button
            className="big-button"
            type={type}
            onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;