import { api } from "@/lib/request.js";

/**
 * @typedef {Object} Settings
 * @property {string} id - Уникальный идентификатор настроек.
 * @property {string} user_id - Уникальный идентификатор пользователя.
 * @property {string} timezone - Часовой пояс пользователя.
 * @property {string} language - Язык интерфейса пользователя.
 */

class SettingsService {
    static async getSettingsByUserId(userId) {
        const response = await api.get(`/settings/user/${userId}`);
        return response.data;
    }

    static async createSettings(settings) {
        const response = await api.post("/settings/", settings);
        return response.data;
    }

    static async updateSettings(userId, settingsData) {
        const response = await api.put(`/settings/user/${userId}`, settingsData);
        return response.data;
    }
}

export default SettingsService;
