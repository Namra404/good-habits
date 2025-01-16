import { api } from "@/lib/request.js";

/**
 * @typedef {Object} Comic
 * @property {string} id - Уникальный идентификатор комикса.
 * @property {string} title - Название комикса.
 * @property {string} description - Описание комикса.
 * @property {number} price - Цена комикса.
 */

class ComicService {
    /**
     * Получить все комиксы.
     * @returns {Promise<Comic[]>} Массив всех комиксов.
     */
    static async getAllComics() {
        const response = await api.get("/comics/");
        return response.data;
    }

    /**
     * Получить комикс по ID.
     * @param {string} comicId - Уникальный идентификатор комикса.
     * @returns {Promise<Comic>} Комикс с указанным ID.
     */
    static async getComicById(comicId) {
        const response = await api.get(`/comics/${comicId}`);
        return response.data;
    }

    /**
     * Создать новый комикс.
     * @param {Comic} comic - Данные нового комикса.
     * @returns {Promise<string>} Уникальный идентификатор созданного комикса.
     */
    static async createComic(comic) {
        const response = await api.post("/comics/", comic);
        return response.data;
    }

    /**
     * Обновить данные комикса.
     * @param {string} comicId - Уникальный идентификатор комикса.
     * @param {Object} comicData - Новые данные для обновления комикса.
     * @returns {Promise<boolean>} True, если обновление успешно.
     */
    static async updateComic(comicId, comicData) {
        const response = await api.put(`/comics/${comicId}`, comicData);
        return response.data;
    }

    /**
     * Удалить комикс.
     * @param {string} comicId - Уникальный идентификатор комикса.
     * @returns {Promise<boolean>} True, если удаление успешно.
     */
    static async deleteComic(comicId) {
        const response = await api.delete(`/comics/${comicId}`);
        return response.data;
    }
}

export default ComicService;
