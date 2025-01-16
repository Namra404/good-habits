import { api } from "@/lib/request.js";

/**
 * @typedef {Object} Role
 * @property {string} id - Уникальный идентификатор роли.
 * @property {string} name - Название роли.
 */

class RoleService {
    static async getRoleById(roleId) {
        const response = await api.get(`/roles/${roleId}`);
        return response.data;
    }

    static async createRole(role) {
        const response = await api.post("/roles/", role);
        return response.data;
    }

    static async assignRoleToUser(userId, roleId) {
        const response = await api.post("/roles/assign", { user_id: userId, role_id: roleId });
        return response.data;
    }

    static async getAllRoles() {
        const response = await api.get("/roles/");
        return response.data;
    }
}

export default RoleService;
