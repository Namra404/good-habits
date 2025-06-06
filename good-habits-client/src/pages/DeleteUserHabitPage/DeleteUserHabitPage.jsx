import React, {useRef} from "react";
import busketSVG from "@/assets/bucket.svg"; // Убедитесь, что путь к SVG правильный
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx"; // Подключение кнопки
import "./DeleteUserHabitPage.css";
import crossSVG from "@/assets/cross.svg";
import useClickOutside from "@/hooks/useClickOutside.jsx"; // Импорт CSS для стилей

function DeleteUserHabitPage({id, onClose, setCheckIns}) {
    const modalRef = useRef(null);
    const handleDelete = () => {
        alert("Delete button clicked! Удали привычку из бд");
        setCheckIns((prev) => prev?.filter((item) => item.id !== id));
    };

    const handleCancel = () => {
        onClose()
    };
    useClickOutside(modalRef, () => {onClose()});
    return (
        <div className="delete-modal" ref={modalRef}>
            <img src={crossSVG} alt="busket" className="close-button" onClick={handleCancel}/>
            <img src={busketSVG} alt="busket" className="delete-icon"/>
            <h1 className="delete-title">ВЫ уверены что хотите удалить?</h1>
            <Button text="Удалить" color="orange" onClick={handleDelete} />
            <Button text="Отмена" color="grey" onClick={handleCancel}/>
        </div>
    );
}

export default DeleteUserHabitPage;
