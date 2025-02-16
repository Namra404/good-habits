import React, {createContext, useContext, useEffect} from "react";
import UserHabitService from "@/services/UserHabit.jsx";
import error from "eslint-plugin-react/lib/util/error.js";

const userContext = createContext(null);

export const UserProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    useEffect(() => {
            const fetchUser = async () => {
                try {
                    // const data = await UserHabitService.auth(window.Telegram.WebApp.initDataUnsafe.user.id);
                    // setUser(data);
                    setUser('3fa85f64-5717-4562-b3fc-2c963f66afa6') //TODO: Н АБЭКЭ ЗАПРОС СОЗДАТЬ И ПРИКРУТИТЬ
                } catch (err) {
                    console.error("Ошибка загрузки привычек:", err);
                }
            };
            fetchUser()
        }, []
    )
    return (
        <userContext.Provider value={{user}}>
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