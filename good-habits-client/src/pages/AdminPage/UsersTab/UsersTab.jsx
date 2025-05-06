import RoleService from "@/services/Role.jsx";
import UserService from "@/services/User.jsx";
import {useState} from "react";

function UsersTab({ users, setUsers, roles, setError }) {
    const [newUser, setNewUser] = useState({ username: '', tg_id: '', coin_balance: 0 });
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const usernameExists = await UserService.isUsernameExists(newUser.username);
            if (usernameExists) {
                setError({ message: 'Имя пользователя уже занято' });
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
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при создании пользователя' });
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await UserService.updateUser(editingUser.id, editingUser);
            if (selectedRole && editingUser.role_id !== selectedRole) {
                await RoleService.assignRoleToUser(editingUser.id, selectedRole);
            }
            const updatedUsers = await UserService.getAllUsers();
            setUsers(updatedUsers);
            setEditingUser(null);
            setSelectedRole('');
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при обновлении пользователя' });
        }
    };

    const startEditingUser = (user) => {
        setEditingUser(user);
        setSelectedRole(user.role_id);
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать пользователя</h2>
            <form onSubmit={handleCreateUser} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Telegram ID"
                        value={newUser.tg_id}
                        onChange={(e) => setNewUser({ ...newUser, tg_id: e.target.value })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Баланс"
                        value={newUser.coin_balance}
                        onChange={(e) => setNewUser({ ...newUser, coin_balance: parseInt(e.target.value) || 0 })}
                        className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
                                        onChange={(e) => setEditingUser({ ...editingUser, coin_balance: parseInt(e.target.value) || 0 })}
                                        className="p-1 border rounded-lg border-gray-300 w-full"
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
        </>
    );
}

export default UsersTab;