import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx"; // Ваш компонент кнопки
import "./SettingsPage.css";
import SettingsService from "@/services/Settings.jsx";
import {useUser} from "@/store/user-provider.jsx"; // Стили для страницы

const SettingsPage = () => {
    const {user} = useUser();
    const userId = user?.id; // Заглушка для user_id

    const [settings, setSettings] = useState({
        timezone: "",
        language: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Получение настроек пользователя
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await SettingsService.getSettingsByUserId(userId);
            setSettings({
                timezone: data.timezone,
                language: data.language,
            });
        } catch (err) {
            console.error("Ошибка при получении настроек:", err);
            setError("Не удалось загрузить настройки. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    // Обновление настроек пользователя
    const updateSettings = async () => {
        try {
            setLoading(true);
            const payload = {
                timezone: settings.timezone,
                language: settings.language,
            };

            console.log("Отправляем данные для обновления:", payload);
            await SettingsService.updateSettings(userId, payload);
        } catch (err) {
            console.error("Ошибка при обновлении настроек:", err);
            setError("Не удалось обновить настройки. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    // Получение настроек при загрузке страницы
    useEffect(() => {
        fetchSettings();
    }, []);

    // Обработчики изменений полей
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="settings-page-wrapper">
            <div className="settings-container">
                <h1 className="settings-title">User Settings</h1>
                {loading ? (
                    <p className="loading-message">Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <form className="settings-form">
                        <label className="form-label">Timezone</label>
                        <input
                            className="form-input"
                            type="text"
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleInputChange}
                            required
                        />

                        <label className="form-label">Язык</label>
                        <input
                            className="form-input"
                            type="text"
                            name="language"
                            value={settings.language}
                            onChange={handleInputChange}
                            required
                        />

                        <Button
                            text="Сохранить"
                            color="orange"
                            onClick={(e) => {
                                e.preventDefault();
                                updateSettings();
                            }}
                        />
                    </form>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;