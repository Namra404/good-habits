import { api } from "@/lib/request.js";

/**
 * @typedef {Object} RewardHistory
 * @property {string} id - Уникальный идентификатор записи истории вознаграждений.
 * @property {string} user_id - Уникальный идентификатор пользователя.
 * @property {number} coins_changes - Изменение количества монет (положительное или отрицательное).
 * @property {string} reward_date - Дата вознаграждения в формате ISO 8601.
 */

class RewardHistoryService {
    static async getHistoryByUserId(userId) {
        const response = await api.get(`/reward-history/user/${userId}`);
        return response.data;
    }

    static async createHistoryEntry(historyEntry) {
        const response = await api.post("/reward-history/", historyEntry);
        return response.data;
    }
}

export default RewardHistoryService;
