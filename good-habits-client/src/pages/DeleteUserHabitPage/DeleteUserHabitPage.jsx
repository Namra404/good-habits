import React from "react";
import busketSVG from "@/assets/bucket.svg"; // Убедитесь, что путь к SVG правильный
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx"; // Подключение кнопки
import "./DeleteUserHabitPage.css";
import crossSVG from "@/assets/cross.svg"; // Импорт CSS для стилей

function DeleteUserHabitPage() {
    const handleDelete = () => {
        alert("Delete button clicked!");
    };

    const handleCancel = () => {
        alert("Cancel button clicked!");
    };

    return (
        <div className="delete-modal">
            <img src={crossSVG} alt="busket" className="close-button" onClick={handleCancel}/>
            <img src={busketSVG} alt="busket" className="delete-icon"/>
            <h1 className="delete-title">Are you sure want to delete?</h1>
            <Button text="Delete" color="orange" onClick={handleDelete} />
            <Button text="Cancel" color="grey" onClick={handleCancel}/>
        </div>
    );
}

export default DeleteUserHabitPage;
