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
        const response = await api.get(`/user_comics/user/${userId}`);
        return response.data;
    }

    /**
     * Добавить комикс для пользователя.
     * @param {UserComic} userComic - Данные о пользовательском комиксе.
     * @returns {Promise<string>} Уникальный идентификатор созданной записи.
     */
    static async addUserComic(userComic) {
        const response = await api.post("/user_comics/", userComic);
        return response.data;
    }

    /**
     * Отправить пользователю ссылку на комикс через Telegram-бота.
     * @param {string} userId - ID пользователя.
     * @param {string} comicId - ID комикса.
     * @returns {Promise<string>} Сообщение об отправке.
     */
    static async sendComicToUser(userId, comicId) {
        const response = await api.post("/user_comics/send_comic", {}, {
            headers: {
                "user-id": userId,  // 🔹 Исправлено (user_id → user-id)
                "comic-id": comicId  // 🔹 Исправлено (comic_id → comic-id)
            }
        });
        return response.data;
    }

    /**
     * Проверить, купил ли пользователь определённый комикс.
     * @param {string} userId - ID пользователя.
     * @param {string} comicId - ID комикса.
     * @returns {Promise<boolean>} Возвращает `true`, если пользователь купил комикс.
     */
    static async userOwnsComic(userId, comicId) {
        const response = await api.get("/user_comics/user/comic/owns", {
            headers: {
                "user_id": userId,
                "comic_id": comicId
            }
        });
        return response.data;
    }
}

export default UserComicService;
