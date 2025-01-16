import { api } from "@/lib/request.js";

/**
 * @typedef {Object} Habit
 * @property {string} id - Уникальный идентификатор привычки.
 * @property {string} user_id - Уникальный идентификатор пользователя.
 * @property {string} title - Название привычки.
 * @property {string} description - Описание привычки.
 * @property {number} duration_days - Длительность привычки в днях.
 * @property {string} goal - Цель привычки.
 */

class HabitService {
    /**
     * Получить все привычки.
     * @returns {Promise<Habit[]>} Массив всех привычек.
     */
    static async getAllHabits() {
        const response = await api.get("/habits/");
        return response.data;
    }

    /**
     * Получить привычку по ID.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @returns {Promise<Habit>} Привычка с указанным ID.
     */
    static async getHabitById(habitId) {
        const response = await api.get(`/habits/${habitId}`);
        return response.data;
    }

    /**
     * Получить все привычки пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @returns {Promise<Habit[]>} Массив привычек пользователя.
     */
    static async getHabitsByUser(userId) {
        const response = await api.get(`/habits/user/${userId}`);
        return response.data;
    }

    /**
     * Создать новую привычку.
     * @param {Habit} habit - Данные новой привычки.
     * @returns {Promise<string>} Уникальный идентификатор созданной привычки.
     */
    static async createHabit(habit) {
        const response = await api.post("/habits/", habit);
        return response.data;
    }

    /**
     * Обновить данные привычки.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @param {Object} habitData - Новые данные для обновления привычки.
     * @returns {Promise<boolean>} True, если обновление успешно.
     */
    static async updateHabit(habitId, habitData) {
        const response = await api.put(`/habits/${habitId}`, habitData);
        return response.data;
    }

    /**
     * Удалить привычку.
     * @param {string} habitId - Уникальный идентификатор привычки.
     * @returns {Promise<boolean>} True, если удаление успешно.
     */
    static async deleteHabit(habitId) {
        const response = await api.delete(`/habits/${habitId}`);
        return response.data;
    }
}

export default HabitService;
