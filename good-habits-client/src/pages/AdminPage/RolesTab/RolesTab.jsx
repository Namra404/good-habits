import React, { useState, useEffect } from 'react';
import RoleService from "@/services/Role.jsx";

function RolesTab({ roles, setRoles }) {
    const [newRole, setNewRole] = useState({ name: '' });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 2000); // Уведомление исчезает через 2 секунды
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateRoleData = (roleData) => {
        if (roleData.name.length < 3) {
            return 'Название роли должно содержать минимум 3 символа.';
        }
        const letterOnlyRegex = /^[a-zA-Zа-яА-Я\s.,-]+$/; // Разрешены буквы, пробелы, точки, запятые и дефисы
        if (!letterOnlyRegex.test(roleData.name)) {
            return 'Название роли не должно содержать чисел или специальных символов (разрешены буквы, пробелы, точки, запятые и дефисы).';
        }
        return null;
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        const validationError = validateRoleData(newRole);
        if (validationError) {
            setNotification(validationError);
            return;
        }

        try {
            await RoleService.createRole(newRole);
            const updatedRoles = await RoleService.getAllRoles();
            setRoles(updatedRoles);
            setNewRole({ name: '' });
            setNotification('Роль успешно создана');
        } catch (err) {
            setNotification(err.message || 'Ошибка при создании роли');
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать роль</h2>
            <div className="relative">
                {notification && (
                    <div className={`absolute top-0 left-0 right-0 p-3 rounded-lg shadow-md mb-4 text-center animate-fade-in ${
                        notification.includes('успешно') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {notification}
                    </div>
                )}
                <form onSubmit={handleCreateRole} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Название роли"
                            value={newRole.name}
                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={3}
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
                    <th>ID</th>
                    <th>Название</th>
                </tr>
                </thead>
                <tbody>
                {roles.map(role => (
                    <tr key={role.id}>
                        <td data-label="ID">{role.id}</td>
                        <td data-label="Название">{role.name}</td>
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

export default RolesTab;