import React, {useEffect, useState} from 'react';
import UserComicService from "@/services/UserComic.jsx";

function UserComicsTab({ userComics, setUserComics, users, comics, setError }) {
    const [newUserComic, setNewUserComic] = useState({
        user_id: '',
        comic_id: '',
        purchase_date: new Date().toISOString()
    });

    useEffect(() => {
        const fetchUserComics = async () => {
            try {
                if (newUserComic.user_id) {
                    const updatedUserComics = await UserComicService.getUserComics(newUserComic.user_id);
                    setUserComics(updatedUserComics);
                }
            } catch (err) {
                setError({ message: err.message || 'Ошибка при загрузке комиксов пользователя' });
            }
        };
        fetchUserComics();
    }, [newUserComic.user_id, setUserComics, setError]);

    const handleAddUserComic = async (e) => {
        e.preventDefault();
        if (!newUserComic.user_id || !newUserComic.comic_id) {
            setError({ message: 'Выберите пользователя и комикс' });
            return;
        }
        try {
            await UserComicService.addUserComic({
                ...newUserComic,
                purchase_date: new Date(newUserComic.purchase_date).toISOString()
            });
            const updatedUserComics = await UserComicService.getUserComics(newUserComic.user_id);
            setUserComics(updatedUserComics);
            setNewUserComic({
                user_id: '',
                comic_id: '',
                purchase_date: new Date().toISOString()
            });
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при добавлении комикса пользователю' });
        }
    };

    const handleSendComic = async (userId, comicId) => {
        try {
            await UserComicService.sendComicToUser(userId, comicId);
            setError(null);
            alert('Комикс успешно отправлен пользователю через Telegram');
        } catch (err) {
            setError({ message: err.message || 'Ошибка при отправке комикса' });
            console.error('Send Comic Error:', err.response?.data || err.message);
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Добавить комикс пользователю</h2>
            <form onSubmit={handleAddUserComic} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                        value={newUserComic.user_id}
                        onChange={(e) => setNewUserComic({ ...newUserComic, user_id: e.target.value })}
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
                    <select
                        value={newUserComic.comic_id}
                        onChange={(e) => setNewUserComic({ ...newUserComic, comic_id: e.target.value })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Выберите комикс</option>
                        {comics.map(comic => (
                            <option key={comic.id} value={comic.id}>
                                {comic.title}
                            </option>
                        ))}
                    </select>
                    <input
                        type="datetime-local"
                        value={newUserComic.purchase_date.split('.')[0]} // Удаляем миллисекунды для совместимости
                        onChange={(e) => setNewUserComic({ ...newUserComic, purchase_date: e.target.value })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Добавить
                </button>
            </form>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Пользователь</th>
                    <th>Комикс</th>
                    <th>Дата покупки</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {userComics.map(uc => (
                    <tr key={uc.id}>
                        <td data-label="Пользователь">
                            {users.find(u => u.id === uc.user_id)?.username || 'Неизвестный'}
                            (ID: {users.find(u => u.id === uc.user_id)?.tg_id || 'N/A'})
                        </td>
                        <td data-label="Комикс">{comics.find(c => c.id === uc.comic_id)?.title || 'N/A'}</td>
                        <td data-label="Дата покупки">{new Date(uc.purchase_date).toLocaleString()}</td>
                        <td data-label="Действия">
                            <button
                                onClick={() => handleSendComic(uc.user_id, uc.comic_id)}
                                className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Отправить в Telegram
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default UserComicsTab;