/* global Telegram */
import {useContext, useEffect, useState} from 'react';
import {useUser} from "@/store/user-provider.jsx";

const TelegramIntegration = () => {
    const [tgData, setTgData] = useState(null);
    const {user} = useUser();
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setTgData({
                initData: window.Telegram.WebApp.initData,
                initDataUnsafe: window.Telegram.WebApp.initDataUnsafe,
            });
        }
    }, []);

    return (
        <div>
            <h3>Telegram WebApp Data:</h3>
            {tgData ? (
                <pre>{JSON.stringify(tgData, null, 2)}</pre>
            ) : (
                <p>Telegram WebApp API не доступен</p>
            )}
        </div>
    );
};

export default TelegramIntegration;
