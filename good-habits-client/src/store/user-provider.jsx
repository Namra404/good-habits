import React, {createContext, useContext, useEffect} from "react";
import UserHabitService from "@/services/UserHabit.jsx";
import error from "eslint-plugin-react/lib/util/error.js";
import UserService from "@/services/User.jsx";

const userContext = createContext(null);

export const UserProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState(null);
    useEffect(() => {
            const fetchUser = async () => {
                try {
                    const data = await UserService.getUserByTgId(window.Telegram.WebApp.initDataUnsafe.user.id);
                    setUser(data);
                } catch (err) {
                    setError(err)
                    console.error("Ошибка загрузки привычек:", err);
                }
            };
            fetchUser()
        }, []
    )
    return (
        <userContext.Provider value={{user, error}}>
            {children}
        </userContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(userContext)
    if (!context) {
        throw new Error(
            "useUser можно использовать только внутри юз контекста"
        )
    }
    return context
};