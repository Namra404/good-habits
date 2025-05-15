import RoleService from "@/services/Role.jsx";
import UserService from "@/services/User.jsx";
import { useState, useEffect } from "react";

function UsersTab({ users, setUsers, roles }) {
    const [newUser, setNewUser] = useState({ username: '', tg_id: '', coin_balance: 0 });
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 2000); // Уведомление исчезает через 2 секунды
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateUserData = (userData) => {
        // Валидация username
        if (userData.username.length < 3) {
            return 'Имя пользователя должно содержать минимум 3 символа.';
        }

        // Валидация tg_id (только цифры)
        const tgIdRegex = /^[0-9]+$/;
        if (!tgIdRegex.test(userData.tg_id)) {
            return 'Telegram ID должен содержать только цифры.';
        }

        // Валидация coin_balance
        if (userData.coin_balance < 0) {
            return 'Баланс не может быть отрицательным.';
        }

        return null; // Если ошибок нет
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const validationError = validateUserData(newUser);
        if (validationError) {
            setNotification(validationError);
            return;
        }

        try {
            const usernameExists = await UserService.isUsernameExists(newUser.username);
            if (usernameExists) {
                setNotification('Имя пользователя уже занято');
                return;
            }

            await UserService.createUser({
                ...newUser,
                role_id: selectedRole || roles[0]?.id
            });
            const updatedUsers = await UserService.getAllUsers();
            setUsers(updatedUsers);
            setNewUser({ username: '', tg_id: '', coin_balance: 0 });
            setSelectedRole('');
            setNotification('Пользователь успешно создан');
        } catch (err) {
            setNotification(err.message || 'Ошибка при создании пользователя');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const validationError = validateUserData(editingUser);
        if (validationError) {
            setNotification(validationError);
            return;
        }

        try {
            // Формируем объект только с изменяемыми полями, исключая created_at и updated_at
            const updatedUserData = {
                username: editingUser.username,
                tg_id: editingUser.tg_id,
                coin_balance: editingUser.coin_balance,
                avatar_url: editingUser.avatar_url,
                role_id: editingUser.role_id
            };

            await UserService.updateUser(editingUser.id, updatedUserData);
            if (selectedRole && editingUser.role_id !== selectedRole) {
                await RoleService.assignRoleToUser(editingUser.id, selectedRole);
                updatedUserData.role_id = selectedRole;
            }
            const updatedUsers = await UserService.getAllUsers();
            setUsers(updatedUsers);
            setEditingUser(null);
            setSelectedRole('');
            setNotification('Пользователь успешно обновлен');
        } catch (err) {
            setNotification(err.message || 'Ошибка при обновлении пользователя');
        }
    };

    const startEditingUser = (user) => {
        setEditingUser(user);
        setSelectedRole(user.role_id);
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать пользователя</h2>
            <div className="relative">
                {notification && (
                    <div className={`absolute top-0 left-0 right-0 p-3 rounded-lg shadow-md mb-4 text-center animate-fade-in ${
                        notification.includes('успешно') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {notification}
                    </div>
                )}
                <form onSubmit={handleCreateUser} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={3}
                        />
                        <input
                            type="text"
                            placeholder="Telegram ID"
                            value={newUser.tg_id}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[0-9]*$/.test(value)) {
                                    setNewUser({ ...newUser, tg_id: value });
                                }
                            }}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Баланс"
                            value={newUser.coin_balance}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setNewUser({ ...newUser, coin_balance: Math.max(0, value) });
                            }}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min="0"
                        />
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Выберите роль</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
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
                    <th>Имя</th>
                    <th>Telegram ID</th>
                    <th>Роль</th>
                    <th>Баланс</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.tg_id}>
                        {editingUser?.id === user.id ? (
                            <>
                                <td data-label="Имя">
                                    <input
                                        type="text"
                                        value={editingUser.username}
                                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                        required
                                        minLength={3}
                                    />
                                </td>
                                <td data-label="Telegram ID">{user.tg_id}</td>
                                <td data-label="Роль">
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td data-label="Баланс">
                                    <input
                                        type="number"
                                        value={editingUser.coin_balance}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setEditingUser({ ...editingUser, coin_balance: Math.max(0, value) });
                                        }}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
                                        required
                                        min="0"
                                    />
                                </td>
                                <td data-label="Действия">
                                    <button
                                        onClick={handleUpdateUser}
                                        className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 mr-2 transition duration-300"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition duration-300"
                                    >
                                        Отмена
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td data-label="Имя">{user.username || 'Без имени'}</td>
                                <td data-label="Telegram ID">{user.tg_id}</td>
                                <td data-label="Роль">{roles.find(r => r.id === user.role_id)?.name || 'N/A'}</td>
                                <td data-label="Баланс">{user.coin_balance}</td>
                                <td data-label="Действия">
                                    <button
                                        onClick={() => startEditingUser(user)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                                    >
                                        Редактировать
                                    </button>
                                </td>
                            </>
                        )}
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

export default UsersTab;