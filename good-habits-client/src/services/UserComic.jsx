import { api } from "@/lib/request.js";

/**
 * @typedef {Object} UserComic
 * @property {string} id - Уникальный идентификатор записи о комиксе пользователя.
 * @property {string} user_id - Уникальный идентификатор пользователя.
 * @property {string} comic_id - Уникальный идентификатор комикса.
 * @property {string} purchase_date - Дата покупки в формате ISO 8601.
 */

class UserComicService {
    /**
     * Получить все комиксы пользователя.
     * @param {string} userId - Уникальный идентификатор пользователя.
     * @returns {Promise<UserComic[]>} Массив пользовательских комиксов.
     */
    static async getUserComics(userId) {
        const response = await api.get(`/user-comics/user/${userId}`);
        return response.data;
    }

    /**
     * Добавить комикс для пользователя.
     * @param {UserComic} userComic - Данные о пользовательском комиксе.
     * @returns {Promise<string>} Уникальный идентификатор созданной записи.
     */
    static async addUserComic(userComic) {
        const response = await api.post("/user-comics/", userComic);
        return response.data;
    }
}

export default UserComicService;
