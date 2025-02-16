import { api } from "@/lib/request.js";

/**
 * Сервис для работы с данными Telegram
 */
class TelegramService {
    /**
     * Отправляет initData на backend для валидации и получения tg_id.
     * @param {string} initData - Строка initData из Telegram WebApp.
     * @returns {Promise<Object>} Ответ от сервера, например: { status: "ok", tg_id: "12345" }
     */
    static async validateInitData(initData) {
        const response = await api.post("/validate/validate", { initData });
        return response.data;
    }
}

export default TelegramService;
