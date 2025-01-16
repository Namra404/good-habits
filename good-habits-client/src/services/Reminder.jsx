import { api } from "@/lib/request.js";

/**
 * @typedef {Object} Reminder
 * @property {string} id - Уникальный идентификатор напоминания.
 * @property {string} habit_id - Уникальный идентификатор привычки.
 * @property {string} user_id - Уникальный идентификатор пользователя.
 * @property {string} reminder_time - Время напоминания в формате ISO 8601.
 * @property {number} frequency - Частота напоминания в минутах.
 * @property {string} deadline_time - Дедлайн для напоминания в формате ISO 8601.
 * @property {string} notification_text - Текст напоминания.
 * @property {boolean} is_active - Статус активности напоминания.
 * @property {string} last_reminder_date - Дата последнего напоминания в формате ISO 8601.
 */

class ReminderService {
    static async getReminderById(reminderId) {
        const response = await api.get(`/reminders/${reminderId}`);
        return response.data;
    }

    static async getRemindersByUserId(userId) {
        const response = await api.get(`/reminders/user/${userId}`);
        return response.data;
    }

    static async createReminder(reminder) {
        const response = await api.post("/reminders/", reminder);
        return response.data;
    }

    static async updateReminder(reminderId, reminderData) {
        const response = await api.put(`/reminders/${reminderId}`, reminderData);
        return response.data;
    }

    static async deleteReminder(reminderId) {
        const response = await api.delete(`/reminders/${reminderId}`);
        return response.data;
    }
}

export default ReminderService;
