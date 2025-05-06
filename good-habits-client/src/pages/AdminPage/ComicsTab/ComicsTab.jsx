import React, { useState } from 'react';
import ComicService from "@/services/Сomic.jsx";


function ComicsTab({ comics, setComics, setError }) {
    const [newComic, setNewComic] = useState({ title: '', description: '', price: 0, file_url: '' });
    const [editingComic, setEditingComic] = useState(null);

    const handleCreateComic = async (e) => {
        e.preventDefault();
        if (newComic.price < 0) {
            setError({ message: 'Цена не может быть отрицательной' });
            return;
        }
        try {
            await ComicService.createComic(newComic);
            const updatedComics = await ComicService.getAllComics();
            setComics(updatedComics);
            setNewComic({ title: '', description: '', price: 0, file_url: '' });
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при создании комикса' });
        }
    };

    const handleUpdateComic = async (e) => {
        e.preventDefault();
        if (editingComic.price < 0) {
            setError({ message: 'Цена не может быть отрицательной' });
            return;
        }
        try {
            const updatedComic = await ComicService.updateComic(editingComic.id, editingComic);
            const fetchedComic = await ComicService.getComicById(updatedComic.id);
            const updatedComics = await ComicService.getAllComics();
            setComics(updatedComics);
            setEditingComic(null);
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при обновлении комикса' });
        }
    };

    const handleDeleteComic = async (comicId) => {
        try {
            await ComicService.deleteComic(comicId);
            const updatedComics = await ComicService.getAllComics();
            setComics(updatedComics);
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при удалении комикса' });
        }
    };

    const startEditingComic = async (comic) => {
        try {
            const fetchedComic = await ComicService.getComicById(comic.id);
            setEditingComic(fetchedComic);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при загрузке данных комикса' });
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать комикс</h2>
            <form onSubmit={handleCreateComic} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Название"
                        value={newComic.title}
                        onChange={(e) => setNewComic({ ...newComic, title: e.target.value })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Описание"
                        value={newComic.description}
                        onChange={(e) => setNewComic({ ...newComic, description: e.target.value })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Цена"
                        value={newComic.price}
                        onChange={(e) => setNewComic({ ...newComic, price: parseFloat(e.target.value) || 0 })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="URL файла"
                        value={newComic.file_url}
                        onChange={(e) => setNewComic({ ...newComic, file_url: e.target.value })}
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
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Цена</th>
                    <th>URL файла</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {comics.map(comic => (
                    <tr key={comic.id}>
                        {editingComic?.id === comic.id ? (
                            <>
                                <td data-label="ID">{comic.id}</td>
                                <td data-label="Название">
                                    <input
                                        type="text"
                                        value={editingComic.title}
                                        onChange={(e) => setEditingComic({ ...editingComic, title: e.target.value })}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                    />
                                </td>
                                <td data-label="Описание">
                                    <input
                                        type="text"
                                        value={editingComic.description}
                                        onChange={(e) => setEditingComic({ ...editingComic, description: e.target.value })}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                    />
                                </td>
                                <td data-label="Цена">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingComic.price}
                                        onChange={(e) => setEditingComic({ ...editingComic, price: parseFloat(e.target.value) || 0 })}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                    />
                                </td>
                                <td data-label="URL файла">
                                    <input
                                        type="text"
                                        value={editingComic.file_url}
                                        onChange={(e) => setEditingComic({ ...editingComic, file_url: e.target.value })}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                    />
                                </td>
                                <td data-label="Действия">
                                    <button
                                        onClick={handleUpdateComic}
                                        className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 mr-2 transition duration-300"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        onClick={() => setEditingComic(null)}
                                        className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 mr-2 transition duration-300"
                                    >
                                        Отмена
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td data-label="ID">{comic.id}</td>
                                <td data-label="Название">{comic.title}</td>
                                <td data-label="Описание">{comic.description}</td>
                                <td data-label="Цена">{comic.price}</td>
                                <td data-label="URL файла">
                                    <a href={comic.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        Открыть
                                    </a>
                                </td>
                                <td data-label="Действия">
                                    <button
                                        onClick={() => startEditingComic(comic)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 mr-2 transition duration-300"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComic(comic.id)}
                                        className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition duration-300"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default ComicsTab;