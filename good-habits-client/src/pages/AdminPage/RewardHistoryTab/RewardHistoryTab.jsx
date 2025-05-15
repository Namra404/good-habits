import React, { useEffect, useState } from 'react';
import RewardHistoryService from "@/services/RewardHistory.jsx";

function RewardHistoryTab({ rewardHistory, setRewardHistory, users }) {
    const [newEntry, setNewEntry] = useState({
        user_id: '',
        coins_changes: 0,
        reward_date: new Date().toISOString()
    });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (newEntry.user_id) {
                    const updatedHistory = await RewardHistoryService.getHistoryByUserId(newEntry.user_id);
                    setRewardHistory(updatedHistory);
                }
            } catch (err) {
                setNotification(err.message || 'Ошибка при загрузке истории наград');
            }
        };
        fetchHistory();
    }, [newEntry.user_id, setRewardHistory]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 2000); // Уведомление исчезает через 2 секунды
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateEntryData = (entryData) => {
        if (!entryData.user_id) {
            return 'Выберите пользователя.';
        }
        if (!Number.isInteger(entryData.coins_changes)) {
            return 'Изменение монет должно быть целым числом.';
        }
        if (entryData.coins_changes < 0) {
            return 'Изменение монет не может быть отрицательным.';
        }
        return null;
    };

    const handleCreateEntry = async (e) => {
        e.preventDefault();
        const validationError = validateEntryData(newEntry);
        if (validationError) {
            setNotification(validationError);
            return;
        }

        try {
            await RewardHistoryService.createHistoryEntry({
                ...newEntry,
                reward_date: new Date(newEntry.reward_date).toISOString()
            });
            const updatedHistory = await RewardHistoryService.getHistoryByUserId(newEntry.user_id);
            setRewardHistory(updatedHistory);
            setNewEntry({
                user_id: '',
                coins_changes: 0,
                reward_date: new Date().toISOString()
            });
            setNotification('Запись истории наград успешно создана');
        } catch (err) {
            setNotification(err.message || 'Ошибка при создании записи истории наград');
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать запись истории наград</h2>
            <div className="relative">
                {notification && (
                    <div className={`absolute top-0 left-0 right-0 p-3 rounded-lg shadow-md mb-4 text-center animate-fade-in ${
                        notification.includes('успешно') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {notification}
                    </div>
                )}
                <form onSubmit={handleCreateEntry} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                            value={newEntry.user_id}
                            onChange={(e) => setNewEntry({ ...newEntry, user_id: e.target.value })}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Выберите пользователя</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username || 'Без имени'} (ID: {user.tg_id})
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Изменение монет"
                            value={newEntry.coins_changes}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setNewEntry({ ...newEntry, coins_changes: Math.max(0, value) });
                            }}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="0"
                        />
                        <input
                            type="datetime-local"
                            value={newEntry.reward_date.split('.')[0]}
                            onChange={(e) => setNewEntry({ ...newEntry, reward_date: e.target.value })}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Создать
                    </button>
                </form>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Пользователь</th>
                    <th>Изменение монет</th>
                    <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                {rewardHistory.map(entry => (
                    <tr key={entry.id}>
                        <td data-label="Пользователь">
                            {users.find(u => u.id === entry.user_id)?.username || 'Неизвестный'}
                            (ID: {users.find(u => u.id === entry.user_id)?.tg_id || 'N/A'})
                        </td>
                        <td data-label="Изменение монет">{entry.coins_changes}</td>
                        <td data-label="Дата">{new Date(entry.reward_date).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <style>
                {`
                    .animate-fade-in {
                        animation: fadeIn 0.3s ease-in;
                    }
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(-10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </>
    );
}

export default RewardHistoryTab;