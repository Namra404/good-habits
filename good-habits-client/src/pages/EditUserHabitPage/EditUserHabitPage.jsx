import React, {useRef, useState} from "react";
import crossSVG from "@/assets/cross.svg";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import useClickOutside from "@/hooks/useClickOutside.jsx";
import CheckinService from "@/services/Сheckin.jsx";

function EditUserHabitPage({ onClose, initialCheckInDate, isCompleted, checkInId, onSuccess }) {
    const modalRef = useRef(null);
    useClickOutside(modalRef, onClose);

    const initialDate = new Date(initialCheckInDate);

    const [time, setTime] = useState(() => {
        const hours = String(initialDate.getHours()).padStart(2, '0');
        const minutes = String(initialDate.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    });

    const [debugTimeInfo, setDebugTimeInfo] = useState(null);

    const handleSave = async () => {
        const [hours, minutes] = time.split(":").map(Number);

        const newDate = new Date(initialCheckInDate);
        newDate.setUTCHours(hours);
        newDate.setUTCMinutes(minutes);
        newDate.setUTCSeconds(0);
        newDate.setUTCMilliseconds(0);

        const now = new Date();

        setDebugTimeInfo({
            nowLocal: now.toString(),
            nowUTC: now.toISOString(),
            newDateUTC: newDate.toISOString(),
        });

        if (newDate.getTime() < now.getTime()) {
            alert("Нельзя установить время в прошлом.");
            return;
        }

        try {
            await CheckinService.updateCheckIn(checkInId, {
                check_in_date: newDate.toISOString(),
            });
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Ошибка при сохранении времени чек-ина:", error);
            alert("Произошла ошибка. Попробуйте ещё раз.");
        }
    };

    return (
        <div className="delete-modal" ref={modalRef}>
            <img src={crossSVG} alt="close" className="close-button" onClick={onClose} />

            <label className="form-label">Check-in Time:</label>
            <input
                className="form-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isCompleted}
            />

            <div className="button-group">
                <Button text="Отменить" color="grey" onClick={onClose} />
                <Button
                    text="Сохранить"
                    color="green"
                    onClick={handleSave}
                    disabled={isCompleted}
                />
            </div>

            {isCompleted && (
                <p className="info-text">Вы не можете изменить время, так как чек-ин уже завершён.</p>
            )}

            {debugTimeInfo && (
                <div className="debug-info" style={{ marginTop: '20px', fontSize: '12px', color: 'gray' }}>
                    <div><strong>Now (local):</strong> {debugTimeInfo.nowLocal}</div>
                    <div><strong>Now (UTC):</strong> {debugTimeInfo.nowUTC}</div>
                    <div><strong>New check-in date (UTC):</strong> {debugTimeInfo.newDateUTC}</div>
                </div>
            )}
        </div>
    );
}

export default EditUserHabitPage;