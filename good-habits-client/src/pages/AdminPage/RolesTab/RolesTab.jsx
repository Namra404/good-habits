import React, {useState} from 'react';
import RoleService from "@/services/Role.jsx";

function RolesTab({ roles, setRoles, setError }) {
    const [newRole, setNewRole] = useState({ name: '' });

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRole.name) {
            setError({ message: 'Введите название роли' });
            return;
        }
        try {
            await RoleService.createRole(newRole);
            const updatedRoles = await RoleService.getAllRoles();
            setRoles(updatedRoles);
            setNewRole({ name: '' });
            setError(null);
        } catch (err) {
            setError({ message: err.message || 'Ошибка при создании роли' });
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Создать роль</h2>
            <form onSubmit={handleCreateRole} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Название роли"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
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
        </>
    );
}

export default RolesTab;