import React, {useEffect, useState} from 'react';
import RewardHistoryService from "@/services/RewardHistory.jsx";

function RewardHistoryTab({ rewardHistory, setRewardHistory, users, setError }) {
    const [newEntry, setNewEntry] = useState({
        user_id: '',
        coins_changes: 0,
        reward_date: new Date().toISOString()
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (newEntry.user_id) {
                    const updatedHistory = await RewardHistoryService.getHistoryByUserId(newEntry.user_id);
                    setRewardHistory(updatedHistory);
                }
            } catch (err) {
                setError({ message: err.message || 'Ошибка при загрузке истории наград' });
            }
        };
        fetchHistory();
    }, [newEntry.user_id, setRewardHistory, setError]);

    const handleCreateEntry = async (e) => {
        e.preventDefault();
        if (!newEntry.user_id) {
            setError({ message: 'Выберите пользователя' });
            return;
        }
        if (!Number.isInteger(newEntry.coins_changes)) {
            setError({ message: 'Изменение монет должно быть целым числом' });
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
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при создании записи истории наград' });
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать запись истории наград</h2>
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
                        onChange={(e) => setNewEntry({ ...newEntry, coins_changes: parseInt(e.target.value) || 0 })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
        </>
    );
}

export default RewardHistoryTab;