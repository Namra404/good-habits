const Button = ({ text = "OK", onClick }) => {
    return (
        <button
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;