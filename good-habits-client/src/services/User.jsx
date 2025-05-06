import { api } from "@/lib/request.js";

/**
 * @typedef {Object} User
 * @property {string} id - Уникальный идентификатор пользователя.
 * @property {number} tg_id - Telegram ID пользователя.
 * @property {string} role_id - Уникальный идентификатор роли пользователя.
 * @property {string} [username] - Имя пользователя (опционально).
 * @property {number} coin_balance - Баланс монет пользователя.
 */

class UserService {
    // Замоканный user_id для использования в приложении
    static mockedUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    /**
     * Получить замоканный user_id.
     * @returns {string} user_id
     */
    static getMockedUserId() {
        return this.mockedUserId;
    }

    static async isAdmin(userId) {
        const response = await api.get(`/admin/is-admin/${userId}`);
        return response.data;
    }
    /**
     * Получить всех пользователей.
     * @returns {Promise<User[]>} Массив пользователей.
     */
    static async getAllUsers() {
        const response = await api.get("/users/");
        return response.data;
    }

    /**
     * Получить данные пользователя по ID.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @returns {Promise<User>} Данные пользователя.
     */
    static async getUserById(userId) {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    }

    /**
     * Получить пользователя по Telegram ID.
     * @param {number} tgId - Telegram ID пользователя.
     * @returns {Promise<User>} Данные пользователя.
     */
    static async getUserByTgId(tgId) {
        const response = await api.get(`/users/tg/${tgId}`);
        return response.data;
    }


    /**
     * Создать нового пользователя.
     * @param {User} user - Данные нового пользователя.
     * @returns {Promise<string>} Уникальный идентификатор созданного пользователя.
     */
    static async createUser(user) {
        const response = await api.post("/users/", user);
        return response.data;
    }

    /**
     * Проверить, существует ли пользователь с заданным именем.
     * @param {string} username - Имя пользователя.
     * @returns {Promise<boolean>} True, если пользователь существует.
     */
    static async isUsernameExists(username) {
        const response = await api.get(`/users/exists/username/${username}`);
        return response.data;
    }

    /**
     * Проверить, существует ли пользователь с заданным email.
     * @param {string} email - Электронная почта пользователя.
     * @returns {Promise<boolean>} True, если пользователь существует.
     */
    static async isEmailExists(email) {
        const response = await api.get(`/users/exists/email/${email}`);
        return response.data;
    }

    /**
     * Получить пользователя по имени.
     * @param {string} username - Имя пользователя.
     * @returns {Promise<User>} Данные пользователя.
     */
    static async getUserByUsername(username) {
        const response = await api.get(`/users/username/${username}`);
        return response.data;
    }

    /**
     * Обновить данные пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @param {Object} userData - Новые данные пользователя.
     * @returns {Promise<boolean>} True, если обновление успешно.
     */
    static async updateUser(userId, userData) {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    }
}

export default UserService;
