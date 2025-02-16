import { api } from "@/lib/request.js";

/**
 * @typedef {"in_progress" | "completed"} HabitStatus
 */

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
 * @property {HabitStatus} status - Статус прогресса.
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
        const response = await api.get("/user_habit_progress/all");
        return response.data;
    }

    /**
     * Получить прогресс привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @returns {Promise<UserHabitProgress>} Прогресс привычки.
     */
    static async getHabitProgress(userId, habitId) {
        const response = await api.get(`/user_habit_progress/${userId}/${habitId}`);
        return response.data;
    }

    /**
     * Создать запись о прогрессе привычки.
     * @param {UserHabitProgress} progress - Данные о прогрессе привычки.
     * @returns {Promise<string>} Уникальный идентификатор созданной записи.
     */
    static async createHabitProgress(progress) {
        if (!["in_progress", "completed"].includes(progress.status)) {
            throw new Error(`Invalid status: ${progress.status}. Allowed values: ['in_progress', 'completed']`);
        }
        const response = await api.post("/user_habit_progress/", progress);
        return response.data;
    }

    /**
     * Обновить запись о прогрессе привычки.
     * @param {string} progressId - Уникальный идентификатор прогресса.
     * @param {Object} progressData - Данные для обновления.
     * @returns {Promise<boolean>} True, если обновление успешно.
     */
    static async updateHabitProgress(progressId, progressData) {
        if (progressData.status && !["in_progress", "completed"].includes(progressData.status)) {
            throw new Error(`Invalid status: ${progressData.status}. Allowed values: ['in_progress', 'completed']`);
        }
        const response = await api.put(`/user_habit_progress/${progressId}`, progressData);
        return response.data;
    }

    /**
     * Получить детали прогресса привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @returns {Promise<Object>} Детали прогресса привычки.
     */
    static async getUserHabitDetails(userId, habitId) {
        const response = await api.get(`/user_habit_progress/detail/${userId}/${habitId}`);
        return response.data;
    }

    /**
     * Получить все привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @param {HabitStatus} [status] - Фильтр по статусу (опционально).
     * @returns {Promise<UserHabitProgress[]>} Массив привычек пользователя.
     */
    static async getAllUserHabits(userId, status) {
        const url = status ? `/user_habit_progress/${userId}?status=${status}` : `/user_habit_progress/${userId}`;
        const response = await api.get(url);
        return response.data;
    }
}

export default UserHabitService;
