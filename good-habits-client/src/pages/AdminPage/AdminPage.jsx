import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useUser } from '@/store/user-provider';
import UsersTab from '@/pages/AdminPage/UsersTab/UsersTab';
import ComicsTab from '@/pages/AdminPage/ComicsTab/ComicsTab';
import RolesTab from '@/pages/AdminPage/RolesTab/RolesTab';
import RewardHistoryTab from '@/pages/AdminPage/RewardHistoryTab/RewardHistoryTab';
import UserComicsTab from '@/pages/AdminPage/UserComicsTab/UserComicsTab';
import UserService from "@/services/User.jsx";
import RoleService from "@/services/Role.jsx";
import ComicService from "@/services/Сomic.jsx";
import RewardHistoryService from "@/services/RewardHistory.jsx";
import UserComicService from "@/services/UserComic.jsx";
import './AdminPage.css'

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [comics, setComics] = useState([]);
    const [rewardHistory, setRewardHistory] = useState([]);
    const [userComics, setUserComics] = useState([]);
    const [error, setError] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [activeTab, setActiveTab] = useState('users');
    const location = useLocation();
    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAdmin = await UserService.isAdmin(user?.tg_id);
                if (!isAdmin) {
                    setAccessDenied(true);
                    return;
                }

                const [allUsers, allRoles, allComics, allRewardHistory, allUserComics] = await Promise.all([
                    UserService.getAllUsers(),
                    RoleService.getAllRoles(),
                    ComicService.getAllComics(),
                    RewardHistoryService.getHistoryByUserId('all').catch(() => []),
                    UserComicService.getUserComics('all').catch(() => [])
                ]);
                setUsers(allUsers);
                setRoles(allRoles);
                setComics(allComics);
                setRewardHistory(allRewardHistory);
                setUserComics(allUserComics);
            } catch (err) {
                setError({
                    message: err.message || 'Ошибка загрузки данных',
                    status: err.response?.status,
                    fullResponse: JSON.stringify(err.response?.data || {}, null, 2)
                });
            }
        };

        if (user?.id) {
            fetchData();
        }
    }, [location, user]);

    if (accessDenied) {
        return (
            <div className="admin-panel">
                <div className="error-container">
                    <h2>Доступ запрещён</h2>
                    <p>У вас нет прав для просмотра этой страницы.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-panel">
                <div className="error-container">
                    <h2>Ошибка</h2>
                    <p><strong>Сообщение:</strong> {error.message}</p>
                    {error.status && <p><strong>Статус HTTP:</strong> {error.status}</p>}
                    {error.fullResponse && (
                        <div>
                            <strong>Полный ответ сервера:</strong>
                            <pre>{error.fullResponse}</pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!users.length && !roles.length && !comics.length && !rewardHistory.length && !userComics.length) {
        return <div className="admin-panel loading">Загрузка...</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Админ-панель</h1>
            <div className="admin-tabs">
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button
                    className={activeTab === 'roles' ? 'active' : ''}
                    onClick={() => setActiveTab('roles')}
                >
                    Роли
                </button>
                <button
                    className={activeTab === 'comics' ? 'active' : ''}
                    onClick={() => setActiveTab('comics')}
                >
                    Комиксы
                </button>
                <button
                    className={activeTab === 'rewardHistory' ? 'active' : ''}
                    onClick={() => setActiveTab('rewardHistory')}
                >
                    История наград
                </button>
                <button
                    className={activeTab === 'userComics' ? 'active' : ''}
                    onClick={() => setActiveTab('userComics')}
                >
                    Комиксы пользователей
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <UsersTab
                        users={users}
                        setUsers={setUsers}
                        roles={roles}
                        setError={setError}
                    />
                )}
                {activeTab === 'roles' && (
                    <RolesTab
                        roles={roles}
                        setRoles={setRoles}
                        setError={setError}
                    />
                )}
                {activeTab === 'comics' && (
                    <ComicsTab
                        comics={comics}
                        setComics={setComics}
                        setError={setError}
                    />
                )}
                {activeTab === 'rewardHistory' && (
                    <RewardHistoryTab
                        rewardHistory={rewardHistory}
                        setRewardHistory={setRewardHistory}
                        users={users}
                        setError={setError}
                    />
                )}
                {activeTab === 'userComics' && (
                    <UserComicsTab
                        userComics={userComics}
                        setUserComics={setUserComics}
                        users={users}
                        comics={comics}
                        setError={setError}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminPanel;