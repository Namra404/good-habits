import { api } from "@/lib/request.js";

/**
 * @typedef {Object} HabitCheckIn
 * @property {string} id - Уникальный идентификатор записи.
 * @property {string} title - Заголовок записи.
 * @property {string} progress_id - Уникальный идентификатор прогресса.
 * @property {string} check_in_date - Дата записи в формате ISO 8601.
 * @property {number} check_in_number - Номер записи за день.
 * @property {boolean} is_completed - Статус завершенности записи.
 */

/**
 * @typedef {Object} UserHabitProgress
 * @property {string} id - Уникальный идентификатор прогресса.
 * @property {string} habit_id - Уникальный идентификатор привычки.
 * @property {string} user_id - Уникальный идентификатор пользователя.
 * @property {string} start_date - Дата начала прогресса.
 * @property {string|null} last_check_in_date - Последняя дата проверки.
 * @property {number} checkin_amount_per_day - Количество записей в день.
 * @property {string} status - Статус прогресса ("in_progress", "completed" и т.д.).
 * @property {number} reward_coins - Количество вознаграждений в монетах.
 * @property {number} completed_days - Количество завершенных дней.
 * @property {HabitCheckIn[]} check_ins - Список записей прогресса.
 */

class UserHabitService {
    /**
     * Получить все записи о прогрессе привычек.
     * @returns {Promise<UserHabitProgress[]>} Массив записей прогресса.
     */
    static async getAllHabitProgress() {
        const response = await api.get("/habits/all");
        return response.data;
    }

    /**
     * Получить прогресс привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @returns {Promise<UserHabitProgress>} Прогресс привычки.
     */
    static async getHabitProgress(userId, habitId) {
        const response = await api.get(`/habits/${userId}/${habitId}`);
        return response.data;
    }

    /**
     * Создать запись о прогрессе привычки.
     * @param {UserHabitProgress} progress - Данные о прогрессе привычки.
     * @returns {Promise<string>} Уникальный идентификатор созданной записи.
     */
    static async createHabitProgress(progress) {
        const response = await api.post("/habits/", progress);
        return response.data;
    }

    /**
     * Обновить запись о прогрессе привычки.
     * @param {string} progressId - Уникальный идентификатор прогресса.
     * @param {Object} progressData - Данные для обновления.
     * @returns {Promise<boolean>} True, если обновление успешно.
     */
    static async updateHabitProgress(progressId, progressData) {
        const response = await api.put(`/habits/${progressId}`, progressData);
        return response.data;
    }

    /**
     * Получить детали прогресса привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @returns {Promise<Object>} Детали прогресса привычки.
     */
    static async getUserHabitDetails(userId, habitId) {
        const response = await api.get(`/habits/detail/${userId}/${habitId}`);
        return response.data;
    }

    /**
     * Получить все привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @returns {Promise<UserHabitProgress[]>} Массив привычек пользователя.
     */
    static async getAllUserHabits(userId) {
        const response = await api.get(`/user_habit_progress/${userId}`);
        return response.data;
    }
}

export default UserHabitService;
