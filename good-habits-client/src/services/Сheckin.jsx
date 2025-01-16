import { api } from "@/lib/request.js";

/**
 * @typedef {Object} HabitCheckIn
 * @property {string} id - Уникальный идентификатор чек-ина.
 * @property {string} title - Заголовок чек-ина.
 * @property {string} progress_id - Уникальный идентификатор прогресса.
 * @property {string} check_in_date - Дата чек-ина в формате ISO 8601.
 * @property {number} check_in_number - Номер чек-ина за день.
 * @property {boolean} is_completed - Статус завершенности чек-ина.
 */

class CheckinService {
    /**
     * Получить все чек-ины.
     * @returns {Promise<HabitCheckIn[]>} Массив всех чек-инов.
     */
    static async getAllCheckIns() {
        const response = await api.get("/checkins/");
        return response.data;
    }

    /**
     * Получить чек-ин по ID.
     * @param {string} checkInId - Уникальный идентификатор чек-ина.
     * @returns {Promise<HabitCheckIn>} Чек-ин с указанным ID.
     */
    static async getCheckInById(checkInId) {
        const response = await api.get(`/checkins/${checkInId}`);
        return response.data;
    }

    /**
     * Получить все чек-ины по прогрессу привычки.
     * @param {string} progressId - Уникальный идентификатор прогресса.
     * @returns {Promise<HabitCheckIn[]>} Массив чек-инов по прогрессу.
     */
    static async getCheckInsByProgress(progressId) {
        const response = await api.get(`/checkins/progress/${progressId}`);
        return response.data;
    }

    /**
     * Создать новый чек-ин.
     * @param {HabitCheckIn} checkIn - Данные нового чек-ина.
     * @returns {Promise<string>} Уникальный идентификатор созданного чек-ина.
     */
    static async createCheckIn(checkIn) {
        const response = await api.post("/checkins/", checkIn);
        return response.data;
    }

    /**
     * Создать несколько чек-инов.
     * @param {HabitCheckIn[]} checkIns - Массив данных чек-инов.
     * @returns {Promise<number>} Количество созданных чек-инов.
     */
    static async createBulkCheckIns(checkIns) {
        const response = await api.post("/checkins/bulk", checkIns);
        return response.data;
    }

    /**
     * Обновить данные чек-ина.
     * @param {string} checkInId - Уникальный идентификатор чек-ина.
     * @param {Object} checkInData - Данные для обновления чек-ина.
     * @returns {Promise<boolean>} True, если обновление успешно.
     */
    static async updateCheckIn(checkInId, checkInData) {
        const response = await api.put(`/checkins/${checkInId}`, checkInData);
        return response.data;
    }

    /**
     * Удалить чек-ин.
     * @param {string} checkInId - Уникальный идентификатор чек-ина.
     * @returns {Promise<boolean>} True, если удаление успешно.
     */
    static async deleteCheckIn(checkInId) {
        const response = await api.delete(`/checkins/${checkInId}`);
        return response.data;
    }

    /**
     * Получить все чек-ины пользователя за сегодняшний день.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @returns {Promise<HabitCheckIn[]>} Массив чек-инов пользователя за сегодня.
     */
    static async getTodayCheckIns(userId) {
        const response = await api.get(`/habit_checkin/today/${userId}`);
        return response.data;
    }
}

export default CheckinService;
